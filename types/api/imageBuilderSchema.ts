/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/version": {
    /**
     * get the service version
     * @description get the service version
     */
    get: operations["getVersion"];
  };
  "/ready": {
    /** return the readiness */
    get: operations["getReadiness"];
  };
  "/openapi.json": {
    /** get the openapi json specification */
    get: operations["getOpenapiJson"];
  };
  "/distributions": {
    /** get the available distributions */
    get: operations["getDistributions"];
  };
  "/architectures/{distribution}": {
    /** get the architectures and their image types available for a given distribution */
    get: operations["getArchitectures"];
  };
  "/composes": {
    /** get a collection of previous compose requests for the logged in user */
    get: {
      parameters: {
        query?: {
          /** @description max amount of composes, default 100 */
          limit?: number;
          /** @description composes page offset, default 0 */
          offset?: number;
        };
      };
      responses: {
        /** @description a list of composes */
        200: {
          content: {
            "application/json": components["schemas"]["ComposesResponse"];
          };
        };
      };
    };
  };
  "/composes/{composeId}": {
    /**
     * get status of an image compose
     * @description status of an image compose
     */
    get: operations["getComposeStatus"];
    /**
     * delete a compose
     * @description Deletes a compose, the compose will still count towards quota.
     */
    delete: operations["deleteCompose"];
    parameters: {
      path: {
        /** @description Id of compose */
        composeId: string;
      };
    };
  };
  "/composes/{composeId}/metadata": {
    /**
     * get metadata of an image compose
     * @description metadata for an image compose
     */
    get: operations["getComposeMetadata"];
  };
  "/composes/{composeId}/clone": {
    /**
     * clone a compose
     * @description Clones a compose. Only composes with the 'aws' image type currently support cloning.
     */
    post: operations["cloneCompose"];
  };
  "/composes/{composeId}/clones": {
    /**
     * get clones of a compose
     * @description Returns a list of all the clones which were started for a compose
     */
    get: operations["getComposeClones"];
  };
  "/clones/{id}": {
    /**
     * get status of a compose clone
     * @description status of a clone
     */
    get: operations["getCloneStatus"];
  };
  "/compose": {
    /**
     * compose image
     * @description compose image
     */
    post: operations["composeImage"];
  };
  "/packages": {
    get: {
      parameters: {
        query: {
          /** @description distribution to look up packages for */
          distribution: components["schemas"]["Distributions"];
          /** @description architecture to look up packages for */
          architecture: "x86_64" | "aarch64";
          /** @description packages to look for */
          search: string;
          /** @description max amount of packages, default 100 */
          limit?: number;
          /** @description packages page offset, default 0 */
          offset?: number;
        };
      };
      responses: {
        /** @description a list of packages */
        200: {
          content: {
            "application/json": components["schemas"]["PackagesResponse"];
          };
        };
      };
    };
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    HTTPError: {
      title: string;
      detail: string;
    };
    HTTPErrorList: {
      errors: (components["schemas"]["HTTPError"])[];
    };
    Version: {
      version: string;
    };
    Readiness: {
      readiness: string;
    };
    DistributionsResponse: (components["schemas"]["DistributionItem"])[];
    DistributionItem: {
      /** @example Red Hat Enterprise Linux (RHEL) 8.4 */
      description: string;
      /** @example rhel-84 */
      name: string;
    };
    Architectures: (components["schemas"]["ArchitectureItem"])[];
    ArchitectureItem: {
      /** @example x86_64 */
      arch: string;
      image_types: (string)[];
      /** @description Base repositories for the given distribution and architecture. */
      repositories: (components["schemas"]["Repository"])[];
    };
    ComposeStatus: {
      image_status: components["schemas"]["ImageStatus"];
      request: components["schemas"]["ComposeRequest"];
    };
    ImageStatus: {
      /**
       * @example success
       * @enum {string}
       */
      status: "success" | "failure" | "pending" | "building" | "uploading" | "registering";
      upload_status?: components["schemas"]["UploadStatus"];
      error?: components["schemas"]["ComposeStatusError"];
    };
    ComposeStatusError: {
      id: number;
      reason: string;
      details?: unknown;
    };
    UploadStatus: {
      /** @enum {string} */
      status: "success" | "failure" | "pending" | "running";
      type: components["schemas"]["UploadTypes"];
      options: components["schemas"]["AWSUploadStatus"] | components["schemas"]["AWSS3UploadStatus"] | components["schemas"]["GCPUploadStatus"] | components["schemas"]["AzureUploadStatus"];
    };
    AWSUploadStatus: {
      /** @example ami-0c830793775595d4b */
      ami: string;
      /** @example eu-west-1 */
      region: string;
    };
    AWSS3UploadStatus: {
      url: string;
    };
    GCPUploadStatus: {
      /** @example ascendant-braid-303513 */
      project_id: string;
      /** @example my-image */
      image_name: string;
    };
    AzureUploadStatus: {
      /** @example my-image */
      image_name: string;
    };
    ComposeRequest: {
      distribution: components["schemas"]["Distributions"];
      /** @example MyImageName */
      image_name?: string;
      /** @description Array of exactly one image request. Having more image requests in one compose is currently not supported. */
      image_requests: (components["schemas"]["ImageRequest"])[];
      customizations?: components["schemas"]["Customizations"];
    };
    /** @enum {string} */
    Distributions: "rhel-8" | "rhel-84" | "rhel-85" | "rhel-86" | "rhel-87" | "rhel-88" | "rhel-9" | "rhel-90" | "rhel-91" | "rhel-92" | "centos-8" | "centos-9" | "fedora-35" | "fedora-36" | "fedora-37" | "fedora-38";
    ImageRequest: {
      /**
       * @description CPU architecture of the image, x86_64 and aarch64 are currently supported.
       *
       * @enum {string}
       */
      architecture: "x86_64" | "aarch64";
      image_type: components["schemas"]["ImageTypes"];
      upload_request: components["schemas"]["UploadRequest"];
      ostree?: components["schemas"]["OSTree"];
    };
    /** @enum {string} */
    ImageTypes: "aws" |"aws.s3"| "azure" | "edge-commit" | "edge-installer" | "gcp" | "guest-image" | "image-installer" | "vsphere" | "ami" | "rhel-edge-commit" | "rhel-edge-installer" | "vhd";
    ComposesResponse: {
      meta: {
        count: number;
      };
      links: {
        /** @example /api/image-builder/v1/composes?limit=10&offset=0 */
        first: string;
        /** @example /api/image-builder/v1/composes?limit=10&offset=10 */
        last: string;
      };
      data: (components["schemas"]["ComposesResponseItem"])[];
    };
    ComposesResponseItem: {
      /** Format: uuid */
      id: string;
      request: unknown;
      created_at: string;
      image_name?: string;
    };
    ComposeResponse: {
      /** Format: uuid */
      id: string;
    };
    UploadRequest: {
      type: components["schemas"]["UploadTypes"];
      options: components["schemas"]["AWSUploadRequestOptions"] | components["schemas"]["AWSS3UploadRequestOptions"] | components["schemas"]["GCPUploadRequestOptions"] | components["schemas"]["AzureUploadRequestOptions"];
    };
    /** @enum {string} */
    UploadTypes: "aws" | "gcp" | "azure" | "aws.s3";
    AWSUploadRequestOptions: {
      /**
       * @example [
       *   "123456789012"
       * ]
       */
      share_with_accounts?: (string)[];
      /**
       * @example [
       *   "12345"
       * ]
       */
      share_with_sources?: (string)[];
    };
    AWSS3UploadRequestOptions: Record<string, never>;
    GCPUploadRequestOptions: {
      /**
       * @description List of valid Google accounts to share the imported Compute Node image with.
       * Each string must contain a specifier of the account type. Valid formats are:
       *   - 'user:{emailid}': An email address that represents a specific
       *     Google account. For example, 'alice@example.com'.
       *   - 'serviceAccount:{emailid}': An email address that represents a
       *     service account. For example, 'my-other-app@appspot.gserviceaccount.com'.
       *   - 'group:{emailid}': An email address that represents a Google group.
       *     For example, 'admins@example.com'.
       *   - 'domain:{domain}': The G Suite domain (primary) that represents all
       *     the users of that domain. For example, 'google.com' or 'example.com'.
       *     If not specified, the imported Compute Node image is not shared with any
       *     account.
       *
       * @example [
       *   "user:alice@example.com",
       *   "serviceAccount:my-other-app@appspot.gserviceaccount.com",
       *   "group:admins@example.com",
       *   "domain:example.com"
       * ]
       */
      share_with_accounts: (string)[];
    };
    AzureUploadRequestOptions: {
      /**
       * @description ID of the source that will be used to resolve the tenant and subscription IDs.
       * Do not provide a tenant_id or subscription_id when providing a source_id.
       *
       * @example 12345
       */
      source_id?: string;
      /**
       * @description ID of the tenant where the image should be uploaded. This link explains how
       * to find it in the Azure Portal:
       * https://docs.microsoft.com/en-us/azure/active-directory/fundamentals/active-directory-how-to-find-tenant
       * When providing a tenant_id, also be sure to provide a subscription_id and do not include a source_id.
       *
       * @example 5c7ef5b6-1c3f-4da0-a622-0b060239d7d7
       */
      tenant_id?: string;
      /**
       * @description ID of subscription where the image should be uploaded.
       * When providing a subscription_id, also be sure to provide a tenant_id and do not include a source_id.
       *
       * @example 4e5d8b2c-ab24-4413-90c5-612306e809e2
       */
      subscription_id?: string;
      /**
       * @description Name of the resource group where the image should be uploaded.
       *
       * @example ToucanResourceGroup
       */
      resource_group: string;
      /**
       * @description Name of the created image.
       * Must begin with a letter or number, end with a letter, number or underscore, and may contain only letters, numbers, underscores, periods, or hyphens.
       * The total length is limited to 60 characters.
       *
       * @example LinuxImage
       */
      image_name?: string;
    };
    Customizations: {
      subscription?: components["schemas"]["Subscription"];
      /**
       * @example [
       *   "postgresql"
       * ]
       */
      packages?: (string)[];
      payload_repositories?: (components["schemas"]["Repository"])[];
      custom_repositories?: (components["schemas"]["CustomRepository"])[];
      filesystem?: (components["schemas"]["Filesystem"])[];
      /** @description list of users that a customer can add, also specifying their respective groups and SSH keys */
      users?: (components["schemas"]["User"])[];
    };
    User: {
      /** @example user1 */
      name: string;
      /** @example ssh-rsa AAAAB3NzaC1 */
      ssh_key: string;
    };
    Filesystem: {
      /** @example /var */
      mountpoint: string;
      /** @example 1024 */
      min_size: unknown;
    };
    Subscription: {
      /** @example 2040324 */
      organization: number;
      /**
       * Format: password
       * @example my-secret-key
       */
      "activation-key": string;
      /** @example subscription.rhsm.redhat.com */
      "server-url": string;
      /** @example http://cdn.redhat.com/ */
      "base-url": string;
      /** @example true */
      insights: boolean;
      /**
       * @description Optional flag to use rhc to register the system, which also always enables Insights.
       *
       * @default false
       * @example true
       */
      rhc?: boolean;
    };
    OSTree: {
      url?: string;
      /**
       * @description A URL which, if set, is used for fetching content. Implies that `url` is set as well,
       * which will be used for metadata only.
       */
      contenturl?: string;
      /** @example rhel/8/x86_64/edge */
      ref?: string;
      /**
       * @description Can be either a commit (example: 02604b2da6e954bd34b8b82a835e5a77d2b60ffa), or a branch-like reference (example: rhel/8/x86_64/edge)
       *
       * @example rhel/8/x86_64/edge
       */
      parent?: string;
      /**
       * @description Determines whether a valid subscription manager (candlepin) identity is required to
       * access this repository. Consumer certificates will be used as client certificates when
       * fetching metadata and content.
       */
      rhsm?: boolean;
    };
    PackagesResponse: {
      meta: {
        count: number;
      };
      links: {
        /** @example /api/image-builder/v1/packages?limit=10&offset=0&distribution.... */
        first: string;
        /** @example /api/image-builder/v1/packages?limit=10&offset=10&distribution.... */
        last: string;
      };
      data: (components["schemas"]["Package"])[];
    };
    Package: {
      name: string;
      summary: string;
    };
    ComposeMetadata: {
      /** @description Package list including NEVRA */
      packages?: (components["schemas"]["PackageMetadata"])[];
      /** @description ID (hash) of the built commit */
      ostree_commit?: string;
    };
    PackageMetadata: {
      type: string;
      name: string;
      version: string;
      release: string;
      epoch?: string;
      arch: string;
      sigmd5: string;
      signature?: string;
    };
    Repository: {
      rhsm: boolean;
      /**
       * Format: uri
       * @example https://cdn.redhat.com/content/dist/rhel8/8/x86_64/baseos/os/
       */
      baseurl?: string;
      /**
       * Format: uri
       * @example http://mirrorlist.centos.org/?release=8-stream&arch=aarch64&repo=BaseOS
       */
      mirrorlist?: string;
      /**
       * Format: uri
       * @example https://mirrors.fedoraproject.org/metalink?repo=fedora-32&arch=x86_64
       */
      metalink?: string;
      gpgkey?: string;
      check_gpg?: boolean;
      /**
       * @description Enables gpg verification of the repository metadata
       *
       * @default false
       */
      check_repo_gpg?: boolean;
      ignore_ssl?: boolean;
    };
    /**
     * @description Repository configuration for custom repositories.
     * At least one of the 'baseurl', 'mirrorlist', 'metalink' properties must
     * be specified. If more of them are specified, the order of precedence is
     * the same as listed above. Id is required.
     */
    CustomRepository: {
      id: string;
      name?: string;
      filename?: string;
      /**
       * @example [
       *   "https://cdn.redhat.com/content/dist/rhel8/8/x86_64/baseos/os/"
       * ]
       */
      baseurl?: (string)[];
      /**
       * Format: uri
       * @example http://mirrorlist.centos.org/?release=8-stream&arch=aarch64&repo=BaseOS
       */
      mirrorlist?: string;
      /**
       * Format: uri
       * @example https://mirrors.fedoraproject.org/metalink?repo=fedora-32&arch=x86_64
       */
      metalink?: string;
      /**
       * @description GPG key used to sign packages in this repository. Can be a gpg key or a URL
       * @example [
       *   "-----BEGIN PGP PUBLIC KEY BLOCK-----\n\nmQINBGAcScoBEADLf8YHkezJ6adlMYw7aGGIlJalt8Jj2x/B2K+hIfIuxGtpVj7e\nLRgDU76jaT5pVD5mFMJ3pkeneR/cTmqqQkNyQshX2oQXwEzUSb1CNMCfCGgkX8Q2\nzZkrIcCrF0Q2wrKblaudhU+iVanADsm18YEqsb5AU37dtUrM3QYdWg9R+XiPfV8R\nKBjT03vVBOdMSsY39LaCn6Ip1Ovp8IEo/IeEVY1qmCOPAaK0bJH3ufg4Cueks+TS\nwQWTeCLxuZL6OMXoOPKwvMQfxbg1XD8vuZ0Ktj/cNH2xau0xmsAu9HJpekvOPRxl\nyqtjyZfroVieFypwZgvQwtnnM8/gSEu/JVTrY052mEUT7Ccb74kcHFTFfMklnkG/\n0fU4ARa504H3xj0ktbe3vKcPXoPOuKBVsHSv00UGYAyPeuy+87cU/YEhM7k3SVKj\n6eIZgyiMO0wl1YGDRKculwks9A+ulkg1oTb4s3zmZvP07GoTxW42jaK5WS+NhZee\n860XoVhbc1KpS+jfZojsrEtZ8PbUZ+YvF8RprdWArjHbJk2JpRKAxThxsQAsBhG1\n0Lux2WaMB0g2I5PcMdJ/cqjo08ccrjBXuixWri5iu9MXp8qT/fSzNmsdIgn8/qZK\ni8Qulfu77uqhW/wt2btnitgRsqjhxMujYU4Zb4hktF8hKU/XX742qhL5KwARAQAB\ntDFGZWRvcmEgKDM1KSA8ZmVkb3JhLTM1LXByaW1hcnlAZmVkb3JhcHJvamVjdC5v\ncmc+iQJOBBMBCAA4FiEEeH6mrhFH7uVsQLMM20Y5cZhnxY8FAmAcScoCGw8FCwkI\nBwIGFQoJCAsCBBYCAwECHgECF4AACgkQ20Y5cZhnxY+NYA/7BYpglySAZYHhjyKh\n/+f6zPfVvbH20Eq3kI7OFBN0nLX+BU1muvS+qTuS3WLrB3m3GultpKREJKLtm5ED\n1rGzXAoT1yp9YI8LADdMCCOyjAjsoWU87YUuC+/bnjrTeR2LROCfyPC76W985iOV\nm5S+bsQDw7C2LrldAM4MDuoyZ1SitGaZ4KQLVt+TEa14isYSGCjzo7PY8V3JOk50\ngqWg82N/bm2EzS7T83WEDb1lvj4IlvxgIqKeg11zXYxmrYSZJJCfvzf+lNS6uxgH\njx/J0ylZ2LibGr6GAAyO9UWrAZSwSM0EcjT8wECnxkSDuyqmWwVvNBXuEIV8Oe3Y\nMiU1fJN8sd7DpsFx5M+XdnMnQS+HrjTPKD3mWrlAdnEThdYV8jZkpWhDys3/99eO\nhk0rLny0jNwkauf/iU8Oc6XvMkjLRMJg5U9VKyJuWWtzwXnjMN5WRFBqK4sZomMM\nftbTH1+5ybRW/A3vBbaxRW2t7UzNjczekSZEiaLN9L/HcJCIR1QF8682DdAlEF9d\nk2gQiYSQAaaJ0JJAzHvRkRJLLgK2YQYiHNVy2t3JyFfsram5wSCWOfhPeIyLBTZJ\nvrpNlPbefsT957Tf2BNIugzZrC5VxDSKkZgRh1VGvSIQnCyzkQy6EU2qPpiW59G/\nhPIXZrKocK3KLS9/izJQTRltjMA=\n=PfT7\n-----END PGP PUBLIC KEY BLOCK-----\n"
       * ]
       */
      gpgkey?: (string)[];
      check_gpg?: boolean;
      check_repo_gpg?: boolean;
      enabled?: boolean;
      priority?: number;
      ssl_verify?: boolean;
    };
    ClonesResponse: {
      meta: {
        count: number;
      };
      links: {
        /** @example /api/image-builder/v1/composes?limit=10&offset=0 */
        first: string;
        /** @example /api/image-builder/v1/composes?limit=10&offset=10 */
        last: string;
      };
      data: (components["schemas"]["ClonesResponseItem"])[];
    };
    ClonesResponseItem: {
      /** Format: uuid */
      id: string;
      request: unknown;
      created_at: string;
    };
    CloneRequest: components["schemas"]["AWSEC2Clone"];
    AWSEC2Clone: {
      /**
       * @description A region as described in
       * https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html#concepts-regions
       */
      region: string;
      /**
       * @description An array of AWS account IDs as described in
       * https://docs.aws.amazon.com/IAM/latest/UserGuide/console_account-alias.html
       *
       * @example [
       *   "123456789012"
       * ]
       */
      share_with_accounts?: (string)[];
      /**
       * @example [
       *   "12345"
       * ]
       */
      share_with_sources?: (string)[];
    };
    CloneResponse: {
      /**
       * Format: uuid
       * @example 123e4567-e89b-12d3-a456-426655440000
       */
      id: string;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type external = Record<string, never>;

export interface operations {

  /**
   * get the service version
   * @description get the service version
   */
  getVersion: {
    responses: {
      /** @description a service version */
      200: {
        content: {
          "application/json": components["schemas"]["Version"];
        };
      };
    };
  };
  /** return the readiness */
  getReadiness: {
    responses: {
      /** @description readiness */
      200: {
        content: {
          "application/json": components["schemas"]["Readiness"];
        };
      };
    };
  };
  /** get the openapi json specification */
  getOpenapiJson: {
    responses: {
      /** @description returns this document */
      200: {
        content: {
          "application/json": Record<string, never>;
        };
      };
    };
  };
  /** get the available distributions */
  getDistributions: {
    responses: {
      /** @description a list of available distributions */
      200: {
        content: {
          "application/json": components["schemas"]["DistributionsResponse"];
        };
      };
    };
  };
  /** get the architectures and their image types available for a given distribution */
  getArchitectures: {
    parameters: {
      path: {
        /**
         * @description distribution for which to look up available architectures
         * @example rhel-84
         */
        distribution: string;
      };
    };
    responses: {
      /** @description a list of available architectures and their associated image types */
      200: {
        content: {
          "application/json": components["schemas"]["Architectures"];
        };
      };
    };
  };
  /**
   * get status of an image compose
   * @description status of an image compose
   */
  getComposeStatus: {
    parameters: {
      path: {
        /** @description Id of compose */
        composeId: string;
      };
    };
    responses: {
      /** @description compose status */
      200: {
        content: {
          "application/json": components["schemas"]["ComposeStatus"];
        };
      };
    };
  };
  /**
   * delete a compose
   * @description Deletes a compose, the compose will still count towards quota.
   */
  deleteCompose: {
    parameters: {
      path: {
        /** @description Id of compose */
        composeId: string;
      };
    };
    responses: {
      /** @description OK */
      200: never;
    };
  };
  /**
   * get metadata of an image compose
   * @description metadata for an image compose
   */
  getComposeMetadata: {
    parameters: {
      path: {
        /** @description Id of compose metadata to get */
        composeId: string;
      };
    };
    responses: {
      /** @description compose metadata */
      200: {
        content: {
          "application/json": components["schemas"]["ComposeMetadata"];
        };
      };
    };
  };
  /**
   * clone a compose
   * @description Clones a compose. Only composes with the 'aws' image type currently support cloning.
   */
  cloneCompose: {
    parameters: {
      path: {
        /** @description Id of compose to clone */
        composeId: string;
      };
    };
    /** @description details of the new clone */
    requestBody: {
      content: {
        "application/json": components["schemas"]["CloneRequest"];
      };
    };
    responses: {
      /** @description cloning has started */
      201: {
        content: {
          "application/json": components["schemas"]["CloneResponse"];
        };
      };
    };
  };
  /**
   * get clones of a compose
   * @description Returns a list of all the clones which were started for a compose
   */
  getComposeClones: {
    parameters: {
      query?: {
        /** @description max amount of clones, default 100 */
        limit?: number;
        /** @description clones page offset, default 0 */
        offset?: number;
      };
      path: {
        /** @description Id of compose to get the clones of */
        composeId: string;
      };
    };
    responses: {
      /** @description compose clones */
      200: {
        content: {
          "application/json": components["schemas"]["ClonesResponse"];
        };
      };
    };
  };
  /**
   * get status of a compose clone
   * @description status of a clone
   */
  getCloneStatus: {
    parameters: {
      path: {
        /** @description Id of clone status to get */
        id: string;
      };
    };
    responses: {
      /** @description clone status */
      200: {
        content: {
          "application/json": components["schemas"]["UploadStatus"];
        };
      };
    };
  };
  /**
   * compose image
   * @description compose image
   */
  composeImage: {
    /** @description details of image to be composed */
    requestBody: {
      content: {
        "application/json": components["schemas"]["ComposeRequest"];
      };
    };
    responses: {
      /** @description compose has started */
      201: {
        content: {
          "application/json": components["schemas"]["ComposeResponse"];
        };
      };
      /** @description the compose request is malformed */
      400: {
        content: {
          "application/json": components["schemas"]["HTTPErrorList"];
        };
      };
    };
  };
}
