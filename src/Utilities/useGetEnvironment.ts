import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { useFlag } from '@unleash/proxy-client-react';

import { isOnPremise } from '../constants';

export const useGetEnvironment = () => {
  const { isBeta, isProd, getEnvironment } = useChrome();
  // Expose beta features in the ephemeral environment
  if (isBeta() || getEnvironment() === 'qa') {
    return { isBeta: () => true, isProd: isProd };
  }
  return { isBeta: () => false, isProd: isProd };
};

/**
 * A hook that returns the value of a flag with a default value for ephemeral environment.
 * @param flag The flag to check.
 * @param ephemDefault The default value of the flag in ephemeral environment, defaults to true.
 * @returns The value of the flag if the environment is not ephemeral, the selected default otherwise.
 * @example
 *   const isFlagEnabled = useFlagWithEphemDefault('image-builder.my-flag');
 */
export const useFlagWithEphemDefault = (
  flag: string,
  ephemDefault: boolean = true
): boolean => {
  const getFlag = useFlag(flag);
  const { getEnvironment } = useChrome();
  return (getEnvironment() === 'qa' && ephemDefault) || getFlag;
};

export const useGetFeatureFlag = (flagName: string) => {
  // If it's the Cockpit app (on-premise), always return false
  if (isOnPremise) {
    return false;
  }
  switch (flagName) {
    case 'edgeParity.image-list':
    case 'image-builder.snapshots.enabled':
    case 'image-builder.firstboot.enabled':
    case 'image-builder.wsl.enabled':
    case 'image-builder.compliance.enabled':
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useFlag(flagName);
    case 'image-builder.import.enabled':
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useFlagWithEphemDefault(flagName);
    default:
      return undefined;
  }
};
