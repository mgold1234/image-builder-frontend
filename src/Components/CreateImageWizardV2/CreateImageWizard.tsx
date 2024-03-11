import React, { useEffect, useState } from 'react';

import {
  Button,
  Wizard,
  WizardFooterWrapper,
  WizardStep,
  useWizardContext,
  Alert,
} from '@patternfly/react-core';
import { useNavigate, useSearchParams } from 'react-router-dom';

import DetailsStep from './steps/Details';
import FileSystemStep from './steps/FileSystem';
import ImageOutputStep from './steps/ImageOutput';
import OscapStep from './steps/Oscap';
import PackagesStep from './steps/Packages';
import RegistrationStep from './steps/Registration';
import RepositoriesStep from './steps/Repositories';
import ReviewStep from './steps/Review';
import ReviewWizardFooter from './steps/Review/Footer/Footer';
import Aws from './steps/TargetEnvironment/Aws';
import Azure from './steps/TargetEnvironment/Azure';
import Gcp from './steps/TargetEnvironment/Gcp';
import {
  isAwsAccountIdValid,
  isAzureTenantGUIDValid,
  isAzureSubscriptionIdValid,
  isAzureResourceGroupValid,
  isBlueprintDescriptionValid,
  isBlueprintNameValid,
  isGcpEmailValid,
  isFileSystemConfigValid,
} from './validators';

import { RHEL_8 } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import './CreateImageWizard.scss';
import {
  changeDistribution,
  initializeWizard,
  selectActivationKey,
  selectAwsAccountId,
  selectAwsShareMethod,
  selectAwsSourceId,
  selectAzureResourceGroup,
  selectAzureShareMethod,
  selectAzureSource,
  selectAzureSubscriptionId,
  selectAzureTenantId,
  selectBlueprintDescription,
  selectBlueprintName,
  selectGcpEmail,
  selectGcpShareMethod,
  selectImageTypes,
  selectPartitions,
  selectRegistrationType,
} from '../../store/wizardSlice';
import { resolveRelPath } from '../../Utilities/path';
import { ImageBuilderHeader } from '../sharedComponents/ImageBuilderHeader';

type CustomWizardFooterPropType = {
  disableNext: boolean;
};

interface LastStepFooterPropsType {
  isValid: boolean;
  setIsDisableNext(isDisableNext: boolean): void;
  setHasErrorOnSubmit(isSubmitted: boolean): void;
  isDisableNext: boolean;
}

const FileSystemStepFooter: React.FunctionComponent<
  LastStepFooterPropsType
> = ({ isValid, setHasErrorOnSubmit, setIsDisableNext, isDisableNext }) => {
  const { goToNextStep, goToPrevStep } = useWizardContext();

  const onValidate = () => {
    if (!isValid) {
      setIsDisableNext(true);
      setHasErrorOnSubmit(true);
    } else {
      goToNextStep();
    }
  };

  return (
    <WizardFooterWrapper>
      <Button onClick={onValidate} isDisabled={isDisableNext}>
        Next
      </Button>
      <Button variant="secondary" onClick={goToPrevStep}>
        Back
      </Button>
    </WizardFooterWrapper>
  );
};

export const CustomWizardFooter = ({
  disableNext: disableNext,
}: CustomWizardFooterPropType) => {
  const { goToNextStep, goToPrevStep, close } = useWizardContext();
  return (
    <WizardFooterWrapper>
      <Button
        ouiaId="wizard-next-btn"
        variant="primary"
        onClick={goToNextStep}
        isDisabled={disableNext}
      >
        Next
      </Button>
      <Button
        ouiaId="wizard-back-btn"
        variant="secondary"
        onClick={goToPrevStep}
      >
        Back
      </Button>
      <Button ouiaId="wizard-cancel-btn" variant="link" onClick={close}>
        Cancel
      </Button>
    </WizardFooterWrapper>
  );
};

type CreateImageWizardProps = {
  startStepIndex?: number;
};

const CreateImageWizard = ({ startStepIndex = 1 }: CreateImageWizardProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  // IMPORTANT: Ensure the wizard starts with a fresh initial state
  useEffect(() => {
    dispatch(initializeWizard());
    searchParams.get('release') === 'rhel8' &&
      dispatch(changeDistribution(RHEL_8));
    // This useEffect hook should run *only* on mount and therefore has an empty
    // dependency array. eslint's exhaustive-deps rule does not support this use.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*           *
   * Selectors *
   *           */

  // Image Output
  const targetEnvironments = useAppSelector((state) => selectImageTypes(state));
  // AWS
  const awsShareMethod = useAppSelector((state) => selectAwsShareMethod(state));
  const awsAccountId = useAppSelector((state) => selectAwsAccountId(state));
  const awsSourceId = useAppSelector((state) => selectAwsSourceId(state));
  // GCP
  const gcpShareMethod = useAppSelector((state) => selectGcpShareMethod(state));
  const gcpEmail = useAppSelector((state) => selectGcpEmail(state));
  // AZURE
  const azureShareMethod = useAppSelector((state) =>
    selectAzureShareMethod(state)
  );
  const azureTenantId = useAppSelector((state) => selectAzureTenantId(state));
  const azureSubscriptionId = useAppSelector((state) =>
    selectAzureSubscriptionId(state)
  );
  const azureResourceGroup = useAppSelector((state) =>
    selectAzureResourceGroup(state)
  );
  const azureSource = useAppSelector((state) => selectAzureSource(state));
  const registrationType = useAppSelector((state) =>
    selectRegistrationType(state)
  );
  const blueprintName = useAppSelector((state) => selectBlueprintName(state));
  const blueprintDescription = useAppSelector((state) =>
    selectBlueprintDescription(state)
  );
  const activationKey = useAppSelector((state) => selectActivationKey(state));
  const partitions = useAppSelector((state) => selectPartitions(state));
  const [hasErrorOnSubmit, setHasErrorOnSubmit] = useState(false);
  const [isDisableNext, setIsDisableNext] = useState(false);
  useEffect(() => {
    setIsDisableNext(false);
    setHasErrorOnSubmit(false);
  }, [partitions]);
  return (
    <>
      <ImageBuilderHeader />
      <section className="pf-l-page__main-section pf-c-page__main-section">
        <Wizard
          startIndex={startStepIndex}
          onClose={() => navigate(resolveRelPath(''))}
          isVisitRequired
        >
          <WizardStep
            name="Image output"
            id="step-image-output"
            footer={
              <CustomWizardFooter
                disableNext={targetEnvironments.length === 0}
              />
            }
          >
            <ImageOutputStep />
          </WizardStep>
          <WizardStep
            name="Target Environment"
            id="step-target-environment"
            isHidden={
              !targetEnvironments.find(
                (target) =>
                  target === 'aws' || target === 'gcp' || target === 'azure'
              )
            }
            steps={[
              <WizardStep
                name="Amazon Web Services"
                id="wizard-target-aws"
                key="wizard-target-aws"
                footer={
                  <CustomWizardFooter
                    disableNext={
                      awsShareMethod === 'manual'
                        ? !isAwsAccountIdValid(awsAccountId)
                        : awsSourceId === undefined
                    }
                  />
                }
                isHidden={!targetEnvironments.includes('aws')}
              >
                <Aws />
              </WizardStep>,
              <WizardStep
                name="Google Cloud Platform"
                id="wizard-target-gcp"
                key="wizard-target-gcp"
                footer={
                  <CustomWizardFooter
                    disableNext={
                      gcpShareMethod === 'withGoogle' &&
                      !isGcpEmailValid(gcpEmail)
                    }
                  />
                }
                isHidden={!targetEnvironments.includes('gcp')}
              >
                <Gcp />
              </WizardStep>,
              <WizardStep
                name="Azure"
                id="wizard-target-azure"
                key="wizard-target-azure"
                footer={
                  <CustomWizardFooter
                    disableNext={
                      azureShareMethod === 'manual'
                        ? !isAzureTenantGUIDValid(azureTenantId) ||
                          !isAzureSubscriptionIdValid(azureSubscriptionId) ||
                          !isAzureResourceGroupValid(azureResourceGroup)
                        : azureShareMethod === 'sources'
                        ? !isAzureTenantGUIDValid(azureTenantId) ||
                          !isAzureSubscriptionIdValid(azureSubscriptionId) ||
                          !isAzureResourceGroupValid(azureResourceGroup)
                        : azureSource === undefined
                    }
                  />
                }
                isHidden={!targetEnvironments.includes('azure')}
              >
                <Azure />
              </WizardStep>,
            ]}
          />
          <WizardStep
            name="Register"
            id="step-register"
            footer={
              <CustomWizardFooter
                disableNext={
                  registrationType !== 'register-later' && !activationKey
                }
              />
            }
          >
            <RegistrationStep />
          </WizardStep>
          <WizardStep
            name="OpenSCAP"
            id="step-oscap"
            footer={<CustomWizardFooter disableNext={false} />}
          >
            <OscapStep />
          </WizardStep>
          <WizardStep
            name="File system configuration"
            id="step-file-system"
            footer={
              <FileSystemStepFooter
                isValid={
                  !(
                    (isFileSystemConfigValid(partitions)?.duplicates?.length !==
                      0 &&
                      isFileSystemConfigValid(partitions)?.duplicates
                        ?.length !== undefined) ||
                    isFileSystemConfigValid(partitions)?.root === false
                  )
                }
                setHasErrorOnSubmit={setHasErrorOnSubmit}
                setIsDisableNext={setIsDisableNext}
                isDisableNext={isDisableNext}
              />
            }
          >
            {hasErrorOnSubmit &&
              isFileSystemConfigValid(partitions)?.duplicates?.length !== 0 &&
              isFileSystemConfigValid(partitions)?.duplicates?.length !==
                undefined && (
                <div style={{ padding: '15px 0' }}>
                  <Alert
                    isInline
                    variant="danger"
                    title="Duplicate mount points: All mount points must be unique. Remove the duplicate or choose a new mount point."
                  />
                </div>
              )}

            {hasErrorOnSubmit &&
              isFileSystemConfigValid(partitions)?.root === false && (
                <div style={{ padding: '15px 0' }}>
                  <Alert
                    isInline
                    variant="danger"
                    title="No root partition configured."
                  />
                </div>
              )}

            <FileSystemStep />
          </WizardStep>
          <WizardStep
            name="Content"
            id="step-content"
            steps={[
              <WizardStep
                name="Custom repositories"
                id="wizard-custom-repositories"
                key="wizard-custom-repositories"
                footer={<CustomWizardFooter disableNext={false} />}
              >
                <RepositoriesStep />
              </WizardStep>,
              <WizardStep
                name="Additional packages"
                id="wizard-additional-packages"
                key="wizard-additional-packages"
                footer={<CustomWizardFooter disableNext={false} />}
              >
                <PackagesStep />
              </WizardStep>,
            ]}
          ></WizardStep>
          <WizardStep
            name="Details"
            id="step-details"
            footer={
              <CustomWizardFooter
                disableNext={
                  !isBlueprintNameValid(blueprintName) ||
                  !isBlueprintDescriptionValid(blueprintDescription)
                }
              />
            }
          >
            <DetailsStep />
          </WizardStep>
          <WizardStep
            name="Review"
            id="step-review"
            footer={<ReviewWizardFooter />}
          >
            <ReviewStep />
          </WizardStep>
        </Wizard>
      </section>
    </>
  );
};

export default CreateImageWizard;
