import type { Router as RemixRouter } from '@remix-run/router';
import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { CREATE_BLUEPRINT } from '../../../../../constants';
import {
  blueprintRequest,
  clickBack,
  clickNext,
  enterBlueprintName,
  getNextButton,
  interceptBlueprintRequest,
  openAndDismissSaveAndBuildModal,
  verifyCancelButton,
} from '../../wizardTestUtils';
import { clickRegisterLater, renderCreateMode } from '../../wizardTestUtils';

let router: RemixRouter | undefined = undefined;

const CUSTOM_NAME = 'custom-kernel-name';

const goToKernelStep = async () => {
  const user = userEvent.setup();
  const guestImageCheckBox = await screen.findByRole('checkbox', {
    name: /virtualization guest image checkbox/i,
  });
  await waitFor(() => user.click(guestImageCheckBox));
  await clickNext(); // Registration
  await clickRegisterLater();
  await clickNext(); // OpenSCAP
  await clickNext(); // File system configuration
  await clickNext(); // Snapshots
  await clickNext(); // Custom repositories
  await clickNext(); // Additional packages
  await clickNext(); // Users
  await clickNext(); // Timezone
  await clickNext(); // Locale
  await clickNext(); // Hostname
  await clickNext(); // Kernel
};

const goToReviewStep = async () => {
  await clickNext(); // Firewall
  await clickNext(); // First boot script
  await clickNext(); // Details
  await enterBlueprintName();
  await clickNext(); // Review
};

const getKernelNameOptions = async () => {
  return await screen.findByPlaceholderText(/Select kernel package/i);
};

const openKernelNameOptions = async (dropdown: Element) => {
  const user = userEvent.setup();
  await waitFor(() => user.click(dropdown));
};

const selectKernelName = async (kernelName: string) => {
  const user = userEvent.setup();
  const kernelNameDropdown = await getKernelNameOptions();
  await openKernelNameOptions(kernelNameDropdown);

  const kernelOption = await screen.findByText(kernelName);
  await waitFor(() => user.click(kernelOption));
};

const selectCustomKernelName = async (kernelName: string) => {
  const user = userEvent.setup();
  const kernelNameDropdown = await getKernelNameOptions();
  await waitFor(() => user.type(kernelNameDropdown, kernelName));

  const customOption = await screen.findByText(/custom kernel package/i);
  await waitFor(() => user.click(customOption));
};

const clearKernelName = async () => {
  const user = userEvent.setup();
  const kernelNameClearBtn = await screen.findByRole('button', {
    name: /clear input/i,
  });
  await waitFor(() => user.click(kernelNameClearBtn));
};

describe('Step Kernel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    router = undefined;
  });

  test('clicking Next loads Firewall', async () => {
    await renderCreateMode();
    await goToKernelStep();
    await clickNext();
    await screen.findByRole('heading', {
      name: 'Firewall',
    });
  });

  test('clicking Back loads Hostname', async () => {
    await renderCreateMode();
    await goToKernelStep();
    await clickBack();
    await screen.findByRole('heading', { name: 'Hostname' });
  });

  test('clicking Cancel loads landing page', async () => {
    await renderCreateMode();
    await goToKernelStep();
    await verifyCancelButton(router);
  });

  test('adds custom kernel package to options', async () => {
    await renderCreateMode();
    await goToKernelStep();

    const kernelNameDropdown = await getKernelNameOptions();
    await openKernelNameOptions(kernelNameDropdown);
    expect(screen.queryByText(CUSTOM_NAME)).not.toBeInTheDocument();

    await selectCustomKernelName(CUSTOM_NAME);
    await openKernelNameOptions(kernelNameDropdown);
    await screen.findByText(CUSTOM_NAME);
  });

  test('disable Next with invalid custom kernel name', async () => {
    await renderCreateMode();
    await goToKernelStep();

    await selectCustomKernelName('-----------');
    await screen.findByText(/Invalid format/);
    const nextButton = await getNextButton();
    expect(nextButton).toBeDisabled();

    await clearKernelName();
    expect(screen.queryByText(/Invalid format/)).not.toBeInTheDocument();
    expect(nextButton).toBeEnabled();
  });
});

describe('Kernel request generated correctly', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
  });

  test('with kernel name', async () => {
    await renderCreateMode();
    await goToKernelStep();
    await selectKernelName('kernel-debug');
    await goToReviewStep();
    // informational modal pops up in the first test only as it's tied
    // to a 'imageBuilder.saveAndBuildModalSeen' variable in localStorage
    await openAndDismissSaveAndBuildModal();
    const receivedRequest = await interceptBlueprintRequest(CREATE_BLUEPRINT);

    const expectedRequest = {
      ...blueprintRequest,
      customizations: {
        kernel: {
          name: 'kernel-debug',
        },
      },
    };

    await waitFor(() => {
      expect(receivedRequest).toEqual(expectedRequest);
    });
  });

  test('when unselecting kernel name', async () => {
    await renderCreateMode();
    await goToKernelStep();
    await selectKernelName('kernel-debug');
    await clearKernelName();
    await goToReviewStep();
    const receivedRequest = await interceptBlueprintRequest(CREATE_BLUEPRINT);

    const expectedRequest = {
      ...blueprintRequest,
    };

    await waitFor(() => {
      expect(receivedRequest).toEqual(expectedRequest);
    });
  });
});

// TO DO 'Kernel step' -> 'revisit step button on Review works'
// TO DO 'Kernel request generated correctly' -> 'with valid kernel append'
// TO DO 'Kernel request generated correctly' -> 'with valid kernel name and kernel append'
// TO DO 'Kernel edit mode'
