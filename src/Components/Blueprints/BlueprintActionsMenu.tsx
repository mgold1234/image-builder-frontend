import React, { useState } from 'react';

import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
} from '@patternfly/react-core';
import { MenuToggleElement } from '@patternfly/react-core/dist/esm/components/MenuToggle/MenuToggle';
import { EllipsisVIcon } from '@patternfly/react-icons';
import TOML from 'smol-toml';

// The hosted UI exports JSON, while the Cockpit plugin exports TOML.
// Because the blueprint formats differ, using the 'backendApi'
// abstraction would be misleading.  Import and handle each environment
// separately.
import { useIsOnPremise } from '../../Hooks';
import { selectSelectedBlueprintId } from '../../store/BlueprintSlice';
import { useLazyExportBlueprintCockpitQuery } from '../../store/cockpit/cockpitApi';
import type { Blueprint as CockpitExportResponse } from '../../store/cockpit/composerCloudApi';
import { useAppSelector } from '../../store/hooks';
import {
  BlueprintExportResponse,
  useLazyExportBlueprintQuery,
} from '../../store/imageBuilderApi';
import { useFlagWithEphemDefault } from '../../Utilities/useGetEnvironment';
import BetaLabel from '../sharedComponents/BetaLabel';

interface BlueprintActionsMenuProps {
  setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BlueprintActionsMenu: React.FunctionComponent<
  BlueprintActionsMenuProps
> = ({ setShowDeleteModal }: BlueprintActionsMenuProps) => {
  const isOnPremise = useIsOnPremise();
  const [showBlueprintActionsMenu, setShowBlueprintActionsMenu] =
    useState(false);
  const onSelect = () => {
    setShowBlueprintActionsMenu(!showBlueprintActionsMenu);
  };
  const importExportFlag = useFlagWithEphemDefault(
    'image-builder.import.enabled'
  );

  const [trigger] = useLazyExportBlueprintQuery();
  const [cockpitTrigger] = useLazyExportBlueprintCockpitQuery();
  const selectedBlueprintId = useAppSelector(selectSelectedBlueprintId);
  if (selectedBlueprintId === undefined) {
    return null;
  }
  const handleClick = () => {
    trigger({ id: selectedBlueprintId })
      .unwrap()
      .then((response: BlueprintExportResponse) => {
        handleExportBlueprint(response.name, response, isOnPremise);
      });
  };

  const handleCockpitClick = () => {
    cockpitTrigger({ id: selectedBlueprintId })
      .unwrap()
      .then((response: CockpitExportResponse) => {
        handleExportBlueprint(response.name, response, isOnPremise);
      });
  };
  return (
    <Dropdown
      ouiaId={`blueprints-dropdown`}
      isOpen={showBlueprintActionsMenu}
      onSelect={onSelect}
      onOpenChange={(showBlueprintActionsMenu: boolean) =>
        setShowBlueprintActionsMenu(showBlueprintActionsMenu)
      }
      shouldFocusToggleOnSelect
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          isExpanded={showBlueprintActionsMenu}
          onClick={() => setShowBlueprintActionsMenu(!showBlueprintActionsMenu)}
          variant="plain"
          aria-label="blueprint menu toggle"
          data-testid="blueprint-action-menu-toggle"
          isDisabled={selectedBlueprintId === undefined}
        >
          <EllipsisVIcon aria-hidden="true" />
        </MenuToggle>
      )}
    >
      <DropdownList>
        {importExportFlag && (
          <DropdownItem onClick={isOnPremise ? handleCockpitClick : handleClick}>
            Download blueprint ({isOnPremise ? '.toml' : '.json'}) <BetaLabel />
          </DropdownItem>
        )}
        <DropdownItem onClick={() => setShowDeleteModal(true)}>
          Delete blueprint
        </DropdownItem>
      </DropdownList>
    </Dropdown>
  );
};

async function handleExportBlueprint(
  blueprintName: string,
  blueprint: BlueprintExportResponse | CockpitExportResponse,
  isOnPremise: boolean,
) {
  let data: string;
  if (isOnPremise) {
    const tomlString = TOML.stringify(blueprint).trim();
    // Add comment before custom groups section if groups exist
    if (
      'customizations' in blueprint &&
      blueprint.customizations &&
      (('groups' in blueprint.customizations &&
        blueprint.customizations.groups &&
        blueprint.customizations.groups.length > 0) ||
        ('group' in blueprint.customizations &&
          blueprint.customizations.group &&
          blueprint.customizations.group.length > 0))
    ) {
      // Find the position of the first [[customizations.group]] and add comment before it
      const groupIndex = tomlString.indexOf('[[customizations.group]]');
      if (groupIndex !== -1) {
        data =
          tomlString.slice(0, groupIndex) +
          '# Custom groups (defined by user)\n' +
          tomlString.slice(groupIndex);
      } else {
        data = tomlString;
      }
    } else {
      data = tomlString;
    }
  } else {
    data = JSON.stringify(blueprint, null, 2);
  }
  const mime = isOnPremise ? 'application/octet-stream' : 'application/json';
  const blob = new Blob([data], { type: mime });

  const url = URL.createObjectURL(blob);
  // In cockpit we're running in an iframe, the current content-security policy
  // (set in cockpit/public/manifest.json) only allows resources from the same origin as the
  // document (which is unique to the iframe). So create the element in the parent document.
  const link = isOnPremise
    ? window.parent.document.createElement('a')
    : document.createElement('a');
  link.href = url;
  link.download =
    blueprintName.replace(/\s/g, '_').toLowerCase() +
    (isOnPremise ? '.toml' : '.json');
  link.click();
  URL.revokeObjectURL(url);
}
