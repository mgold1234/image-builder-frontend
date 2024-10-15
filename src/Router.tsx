import React, { lazy, Suspense } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useGetFeatureFlag } from 'getFeatureFlag';
import { Route, Routes } from 'react-router-dom';

import EdgeImageDetail from './Components/edge/ImageDetails';
import ShareImageModal from './Components/ShareImageModal/ShareImageModal';
import { manageEdgeImagesUrlName } from './Utilities/edge';

const LandingPage = lazy(() => import('./Components/LandingPage/LandingPage'));
const ImportImageWizard = lazy(
  () => import('./Components/CreateImageWizard/ImportImageWizard')
);
const CreateImageWizard = lazy(() => import('./Components/CreateImageWizard'));

export const Router = () => {
  const edgeParityFlag = useGetFeatureFlag('edgeParity.image-list');
  const importExportFlag = useGetFeatureFlag('image-builder.import.enabled');
  return (
    <Routes>
      <Route
        path="*"
        element={
          <Suspense>
            <LandingPage />
          </Suspense>
        }
      >
        <Route path="share/:composeId" element={<ShareImageModal />} />
      </Route>

      {importExportFlag && (
        <Route
          path="imagewizard/import"
          element={
            <Suspense>
              <ImportImageWizard />
            </Suspense>
          }
        />
      )}
      <Route
        path="imagewizard/:composeId?"
        element={
          <Suspense>
            <CreateImageWizard />
          </Suspense>
        }
      />
      {edgeParityFlag && (
        <Route
          path={`/${manageEdgeImagesUrlName}/:imageId`}
          element={<EdgeImageDetail />}
        >
          <Route path="*" element={<EdgeImageDetail />} />
          <Route
            path={`versions/:imageVersionId/*`}
            element={<EdgeImageDetail />}
          />
        </Route>
      )}
    </Routes>
  );
};
