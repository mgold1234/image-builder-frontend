import {
  useGetClonesQuery,
  useGetComposeStatusQuery,
} from '../../store/apiSlice';

type TargetProps = {
  composeId: string;
};

const Target = ({ composeId }: TargetProps) => {
  const { data: clones } = useGetClonesQuery(composeId);
  const { data: target, isSuccess } = useGetComposeStatusQuery(composeId);
  const targetOptions = {
    aws: 'Amazon Web Services',
    'aws.s3': 'Amazon Web Services',
    azure: 'Microsoft Azure',
    gcp: 'Google Cloud Platform',
    vsphere: 'VMWare',
    'guest-image': 'Virtualization - Guest image',
    'image-installer': 'Bare metal - Installer',
    'edge-commit': 'edge-commit',
    'edge-installer': 'edge-installer',
    ami: 'ami',
    'rhel-edge-commit': 'rhel-edge-commit',
    'rhel-edge-installer': 'rhel-edge-installer',
    vhd: 'vhd',
  };
  let tar;

  if (isSuccess) {
    if (target.request.image_requests[0].upload_request.type === 'aws.s3') {
      tar = targetOptions[target.request.image_requests[0].image_type];
    } else if (target.request.image_requests[0].upload_request.type === 'aws') {
      tar =
        targetOptions[target.request.image_requests[0].upload_request.type] +
        ` (${clones.meta.count !== 0 ? clones.meta.count + 1 : 1}`;
    } else {
      tar = targetOptions[target.request.image_requests[0].upload_request.type];
    }
    return (
      // eslint-disable-next-line react/react-in-jsx-scope
      <>
        {tar ? tar : targetOptions[target.request.image_requests[0].image_type]}
      </>
    );
  }
};

export default Target;
