import {
  GetOscapProfilesApiResponse,
  GetOscapCustomizationsApiResponse,
} from '../../store/imageBuilderApi';

export const distributionOscapProfiles = (): GetOscapProfilesApiResponse => {
  return [
    'xccdf_org.ssgproject.content_profile_cis_workstation_l1',
    'xccdf_org.ssgproject.content_profile_cis_workstation_l2',
    'xccdf_org.ssgproject.content_profile_stig_gui',
  ];
};

export const oscapCustomizations = (
  profile: string
): GetOscapCustomizationsApiResponse => {
  if (profile === 'xccdf_org.ssgproject.content_profile_cis_workstation_l1') {
    return {
      filesystem: [{ min_size: 1073741824, mountpoint: '/tmp' }],
      openscap: {
        profile_id: 'xccdf_org.ssgproject.content_profile_cis_workstation_l1',
        profile_name:
          'CIS Red Hat Enterprise Linux 8 Benchmark for Level 1 - Workstation',
        profile_description:
          'This profile defines a baseline that aligns to the "Level 1 - Workstation" configuration from the Center for Internet Security® Red Hat Enterprise Linux 8 Benchmark™, v2.0.0, released 2022-02-23.  This profile includes Center for Internet Security® Red Hat Enterprise Linux 8 CIS Benchmarks™ content.',
      },
      packages: [
        'aide',
        'sudo',
        'rsyslog',
        'firewalld',
        'nftables',
        'libselinux',
      ],
    };
  }
  if (profile === 'xccdf_org.ssgproject.content_profile_cis_workstation_l2') {
    return {
      filesystem: [
        { min_size: 1073741824, mountpoint: '/tmp' },
        {
          min_size: 1073741824,
          mountpoint: '/tmp',
        },
      ],
      openscap: {
        profile_id: 'xccdf_org.ssgproject.content_profile_cis_workstation_l2',
        profile_name:
          'CIS Red Hat Enterprise Linux 8 Benchmark for Level 2 - Workstation',
        profile_description:
          'This profile defines a baseline that aligns to the "Level 2 - Workstation" configuration from the Center for Internet Security® Red Hat Enterprise Linux 8 Benchmark™, v2.0.0, released 2022-02-23.  This profile includes Center for Internet Security® Red Hat Enterprise Linux 8 CIS Benchmarks™ content.',
      },
      packages: [
        'aide',
        'sudo',
        'rsyslog',
        'firewalld',
        'nftables',
        'libselinux',
      ],
    };
  }
  return {
    filesystem: [
      { min_size: 1073741824, mountpoint: '/tmp' },
      {
        min_size: 1073741824,
        mountpoint: '/tmp',
      },
    ],
    openscap: {
      profile_id: 'xccdf_org.ssgproject.content_profile_stig_gui',
      profile_name: 'DISA STIG with GUI for Red Hat Enterprise Linux 8',
      profile_description:
        'This profile contains configuration checks that align to the DISA STIG with GUI for Red Hat Enterprise Linux 8 V1R11.  In addition to being applicable to Red Hat Enterprise Linux 8, DISA recognizes this configuration baseline as applicable to the operating system tier of Red Hat technologies that are based on Red Hat Enterprise Linux 8, such as:  - Red Hat Enterprise Linux Server - Red Hat Enterprise Linux Workstation and Desktop - Red Hat Enterprise Linux for HPC - Red Hat Storage - Red Hat Containers with a Red Hat Enterprise Linux 8 image  Warning: The installation and use of a Graphical User Interface (GUI) increases your attack vector and decreases your overall security posture. If your Information Systems Security Officer (ISSO) lacks a documented operational requirement for a graphical user interface, please consider using the standard DISA STIG for Red Hat Enterprise Linux 8 profile.',
    },
    packages: [
      'aide',
      'sudo',
      'rsyslog',
      'firewalld',
      'nftables',
      'libselinux',
    ],
  };
};
