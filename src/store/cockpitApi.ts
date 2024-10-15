import { emptyCockpitApi as api } from './emptyCockpitApi';
import {
  GetArchitecturesApiArg,
  GetArchitecturesApiResponse,
  GetBlueprintsApiArg,
  GetBlueprintsApiResponse,
} from './imageBuilderApi';

import cockpit from '../../pkg/lib/cockpit';

// Injects API endpoints into the service for querying blueprints
export const blueprintsReducer = api.injectEndpoints({
  endpoints: (build) => ({
    getArchitectures: build.query<
      GetArchitecturesApiResponse,
      GetArchitecturesApiArg
    >({
      query: (queryArg) => ({ url: `/architectures/${queryArg.distribution}` }),
    }),
    getBlueprints: build.query<GetBlueprintsApiResponse, GetBlueprintsApiArg>({
      queryFn: async () => {
        try {
          if (!cockpit) {
            throw new Error('Cockpit API is not available');
          }

          const directory = cockpit.file(
            '~/.local/share/cockpit/image-builder-frontend/blueprints'
          );
          const fileList = await directory.list(); // Fetch the list of files

          // Read and parse each blueprint file
          const blueprints = await Promise.all(
            fileList.files.map(async (file) => {
              const filePath = `~/.local/share/cockpit/image-builder-frontend/blueprints${file}`;
              const blueprintFile = cockpit.file(filePath);
              const content = await blueprintFile.read();
              return JSON.parse(content);
            })
          );

          directory.close();
          const response: GetBlueprintsApiResponse = {
            meta: { count: blueprints.length },
            links: {
              first: blueprints.length > 0 ? blueprints[0].id : null,
              last:
                blueprints.length > 0
                  ? blueprints[blueprints.length - 1].id
                  : null,
            },
            data: blueprints,
          };
          return { data: response };
        } catch (error) {
          return { error: error.message || 'Unknown error occurred' };
        }
      },
    }),
  }),
});

export const { useGetBlueprintsQuery, useGetArchitecturesQuery } =
  blueprintsReducer;
