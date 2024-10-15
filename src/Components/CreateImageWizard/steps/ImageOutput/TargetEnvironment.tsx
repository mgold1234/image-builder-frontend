import React, { useState } from 'react';

import {
  Button,
  Checkbox,
  FormGroup,
  Popover,
  Radio,
  Text,
  TextContent,
  TextVariants,
  Tile,
} from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useGetArchitecturesQuery } from 'api';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useGetFeatureFlag } from 'getFeatureFlag';

// eslint-disable-next-line import/order
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import { ImageTypes } from '../../../../store/imageBuilderApi';
import { provisioningApi } from '../../../../store/provisioningApi';
import {
  addImageType,
  reinitializeAws,
  reinitializeAzure,
  reinitializeGcp,
  removeImageType,
  selectArchitecture,
  selectDistribution,
  selectImageTypes,
} from '../../../../store/wizardSlice';

const TargetEnvironment = () => {
  const arch = useAppSelector(selectArchitecture);
  const environments = useAppSelector(selectImageTypes);
  const distribution = useAppSelector(selectDistribution);

  const wslFlag = useGetFeatureFlag('image-builder.wsl.enabled');

  const { data } = useGetArchitecturesQuery({
    distribution: distribution,
  });
  // TODO: Handle isFetching state (add skeletons)
  // TODO: Handle isError state (very unlikely...)

  const [hasVSphere, setHasVSphere] = useState(false);

  const dispatch = useAppDispatch();
  const prefetchSources = provisioningApi.usePrefetch('getSourceList');

  const supportedEnvironments = data?.find(
    (elem) => elem.arch === arch
  )?.image_types;

  const handleToggleEnvironment = (environment: ImageTypes) => {
    if (environments.includes(environment)) {
      switch (environment) {
        case 'aws':
          dispatch(reinitializeAws());
          break;
        case 'azure':
          dispatch(reinitializeAzure());
          break;
        case 'gcp':
          dispatch(reinitializeGcp());
      }
      dispatch(removeImageType(environment));
    } else {
      dispatch(addImageType(environment));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, env: ImageTypes) => {
    if (e.key === ' ') {
      e.preventDefault();
      handleToggleEnvironment(env);
    }
  };

  return (
    <FormGroup
      isRequired={true}
      label="Select target environments"
      data-testid="target-select"
    >
      <FormGroup
        label={<Text component={TextVariants.small}>Public cloud</Text>}
        data-testid="target-public"
      >
        <div className="tiles">
          {supportedEnvironments?.includes('aws') && (
            <Tile
              className="tile pf-u-mr-sm"
              data-testid="upload-aws"
              title="Amazon Web Services"
              icon={
                <img
                  className="provider-icon"
                  src={'/apps/frontend-assets/partners-icons/aws.svg'}
                  alt="Amazon Web Services logo"
                />
              }
              onClick={() => {
                handleToggleEnvironment('aws');
              }}
              onKeyDown={(e) => handleKeyDown(e, 'aws')}
              onMouseEnter={() => prefetchSources({ provider: 'aws' })}
              isSelected={environments.includes('aws')}
              isStacked
              isDisplayLarge
            />
          )}
          {supportedEnvironments?.includes('gcp') && (
            <Tile
              className="tile pf-u-mr-sm"
              data-testid="upload-google"
              title="Google Cloud Platform"
              icon={
                <img
                  className="provider-icon"
                  src={
                    '/apps/frontend-assets/partners-icons/google-cloud-short.svg'
                  }
                  alt="Google Cloud Platform logo"
                />
              }
              onClick={() => {
                handleToggleEnvironment('gcp');
              }}
              onKeyDown={(e) => handleKeyDown(e, 'gcp')}
              isSelected={environments.includes('gcp')}
              onMouseEnter={() => prefetchSources({ provider: 'gcp' })}
              isStacked
              isDisplayLarge
            />
          )}
          {supportedEnvironments?.includes('azure') && (
            <Tile
              className="tile pf-u-mr-sm"
              data-testid="upload-azure"
              title="Microsoft Azure"
              icon={
                <img
                  className="provider-icon"
                  src={
                    '/apps/frontend-assets/partners-icons/microsoft-azure-short.svg'
                  }
                  alt="Microsoft Azure logo"
                />
              }
              onClick={() => {
                handleToggleEnvironment('azure');
              }}
              onKeyDown={(e) => handleKeyDown(e, 'azure')}
              onMouseEnter={() => prefetchSources({ provider: 'azure' })}
              isSelected={environments.includes('azure')}
              isStacked
              isDisplayLarge
            />
          )}
          {supportedEnvironments?.includes('oci') && (
            <Tile
              className="tile pf-u-mr-sm"
              data-testid="upload-oci"
              title="Oracle Cloud Infrastructure"
              icon={
                <img
                  className="provider-icon"
                  src={'/apps/frontend-assets/partners-icons/oracle-short.svg'}
                  alt="Oracle Cloud Infrastructure logo"
                />
              }
              onClick={() => {
                handleToggleEnvironment('oci');
              }}
              onKeyDown={(e) => handleKeyDown(e, 'oci')}
              isSelected={environments.includes('oci')}
              isStacked
              isDisplayLarge
            />
          )}
        </div>
      </FormGroup>
      {supportedEnvironments?.includes('vsphere') && (
        <>
          <FormGroup
            label={<Text component={TextVariants.small}>Private cloud</Text>}
            className="pf-u-mt-sm"
            data-testid="target-private"
          >
            <Checkbox
              label="VMware vSphere"
              isChecked={
                environments.includes('vsphere') ||
                environments.includes('vsphere-ova')
              }
              onChange={() => {
                setHasVSphere(!hasVSphere);
                handleToggleEnvironment('vsphere-ova');
              }}
              aria-label="VMware checkbox"
              id="checkbox-vmware"
              name="VMware"
              data-testid="checkbox-vmware"
            />
          </FormGroup>
          <FormGroup
            className="pf-u-mt-sm pf-u-mb-sm pf-u-ml-xl"
            data-testid="target-private-vsphere-radio"
          >
            {supportedEnvironments?.includes('vsphere-ova') && (
              <Radio
                name="vsphere-radio"
                aria-label="VMware vSphere radio button OVA"
                id="vsphere-radio-ova"
                label={
                  <>
                    Open virtualization format (.ova)
                    <Popover
                      maxWidth="30rem"
                      position="right"
                      bodyContent={
                        <TextContent>
                          <Text>
                            An OVA file is a virtual appliance used by
                            virtualization platforms such as VMware vSphere. It
                            is a package that contains files used to describe a
                            virtual machine, which includes a VMDK image, OVF
                            descriptor file and a manifest file.
                          </Text>
                        </TextContent>
                      }
                    >
                      <Button
                        className="pf-u-pl-sm pf-u-pt-0 pf-u-pb-0"
                        variant="plain"
                        aria-label="About OVA file"
                        isInline
                      >
                        <HelpIcon />
                      </Button>
                    </Popover>
                  </>
                }
                onChange={() => {
                  handleToggleEnvironment('vsphere-ova');
                  handleToggleEnvironment('vsphere');
                }}
                isChecked={environments.includes('vsphere-ova')}
                isDisabled={
                  !(
                    environments.includes('vsphere') ||
                    environments.includes('vsphere-ova')
                  )
                }
              />
            )}
            <Radio
              className="pf-u-mt-sm"
              name="vsphere-radio"
              aria-label="VMware vSphere radio button VMDK"
              id="vsphere-radio-vmdk"
              label={
                <>
                  Virtual disk (.vmdk)
                  <Popover
                    maxWidth="30rem"
                    position="right"
                    bodyContent={
                      <TextContent>
                        <Text>
                          A VMDK file is a virtual disk that stores the contents
                          of a virtual machine. This disk has to be imported
                          into vSphere using govc import.vmdk, use the OVA
                          version when using the vSphere UI.
                        </Text>
                      </TextContent>
                    }
                  >
                    <Button
                      className="pf-u-pl-sm pf-u-pt-0 pf-u-pb-0"
                      variant="plain"
                      aria-label="About VMDK file"
                      isInline
                    >
                      <HelpIcon />
                    </Button>
                  </Popover>
                </>
              }
              onChange={() => {
                handleToggleEnvironment('vsphere-ova');
                handleToggleEnvironment('vsphere');
              }}
              isChecked={environments.includes('vsphere')}
              isDisabled={
                !(
                  environments.includes('vsphere') ||
                  environments.includes('vsphere-ova')
                )
              }
            />
          </FormGroup>
        </>
      )}
      <FormGroup
        label={<Text component={TextVariants.small}>Other</Text>}
        data-testid="target-other"
      >
        {supportedEnvironments?.includes('guest-image') && (
          <Checkbox
            label="Virtualization - Guest image (.qcow2)"
            isChecked={environments.includes('guest-image')}
            onChange={() => {
              handleToggleEnvironment('guest-image');
            }}
            aria-label="Virtualization guest image checkbox"
            id="checkbox-guest-image"
            name="Virtualization guest image"
            data-testid="checkbox-guest-image"
          />
        )}
        {supportedEnvironments?.includes('image-installer') && (
          <Checkbox
            label="Bare metal - Installer (.iso)"
            isChecked={environments.includes('image-installer')}
            onChange={() => {
              handleToggleEnvironment('image-installer');
            }}
            aria-label="Bare metal installer checkbox"
            id="checkbox-image-installer"
            name="Bare metal installer"
            data-testid="checkbox-image-installer"
          />
        )}
        {supportedEnvironments?.includes('wsl') && wslFlag && (
          <Checkbox
            label="WSL - Windows Subsystem for Linux (.tar.gz)"
            isChecked={environments.includes('wsl')}
            onChange={() => {
              handleToggleEnvironment('wsl');
            }}
            aria-label="windows subsystem for linux checkbox"
            id="checkbox-wsl"
            name="WSL"
            data-testid="checkbox-wsl"
          />
        )}
      </FormGroup>
    </FormGroup>
  );
};

export default TargetEnvironment;
