import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import promiseMiddleware from 'redux-promise-middleware';

import { blueprintsSlice } from './BlueprintSlice';
import { blueprintsReducer } from './cockpitApi';
import { complianceApi } from './complianceApi';
import { contentSourcesApi } from './contentSourcesApi';
import { edgeApi } from './edgeApi';
import { imageBuilderApi } from './enhancedImageBuilderApi';
import { listenerMiddleware, startAppListening } from './listenerMiddleware';
import { provisioningApi } from './provisioningApi';
import { rhsmApi } from './rhsmApi';
import wizardSlice, {
  changeArchitecture,
  changeDistribution,
  changeImageTypes,
  selectArchitecture,
  selectDistribution,
  selectImageTypes,
} from './wizardSlice';

import { isOnPremise } from '../constants';

export const serviceReducer = combineReducers({
  [contentSourcesApi.reducerPath]: contentSourcesApi.reducer,
  [edgeApi.reducerPath]: edgeApi.reducer,
  [imageBuilderApi.reducerPath]: imageBuilderApi.reducer,
  [rhsmApi.reducerPath]: rhsmApi.reducer,
  [provisioningApi.reducerPath]: provisioningApi.reducer,
  [complianceApi.reducerPath]: complianceApi.reducer,
  [blueprintsReducer.reducerPath]: blueprintsReducer.reducer,
  notifications: notificationsReducer,
  wizard: wizardSlice,
  blueprints: blueprintsSlice.reducer,
});

export const onPremReducer = combineReducers({
  [contentSourcesApi.reducerPath]: contentSourcesApi.reducer,
  [imageBuilderApi.reducerPath]: imageBuilderApi.reducer,
  [rhsmApi.reducerPath]: rhsmApi.reducer,
  [blueprintsReducer.reducerPath]: blueprintsReducer.reducer,
  notifications: notificationsReducer,
  wizard: wizardSlice,
  blueprints: blueprintsSlice.reducer,
});

startAppListening({
  actionCreator: changeArchitecture,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState();

    const distribution = selectDistribution(state);
    const imageTypes = selectImageTypes(state);
    const architecture = action.payload;

    // The response from the RTKQ getArchitectures hook
    const architecturesResponse =
      imageBuilderApi.endpoints.getArchitectures.select({
        distribution: distribution,
      })(state);

    const allowedImageTypes = architecturesResponse?.data?.find(
      (elem) => elem.arch === architecture
    )?.image_types;

    const filteredImageTypes = imageTypes.filter((imageType) =>
      allowedImageTypes?.includes(imageType)
    );

    listenerApi.dispatch(changeImageTypes(filteredImageTypes));
  },
});

startAppListening({
  actionCreator: changeDistribution,
  effect: (action, listenerApi) => {
    const state = listenerApi.getState();

    const distribution = action.payload;
    const imageTypes = selectImageTypes(state);
    const architecture = selectArchitecture(state);

    // The response from the RTKQ getArchitectures hook
    const architecturesResponse =
      imageBuilderApi.endpoints.getArchitectures.select({
        distribution: distribution,
      })(state);

    const allowedImageTypes = architecturesResponse?.data?.find(
      (elem) => elem.arch === architecture
    )?.image_types;

    const filteredImageTypes = imageTypes.filter((imageType) =>
      allowedImageTypes?.includes(imageType)
    );

    listenerApi.dispatch(changeImageTypes(filteredImageTypes));
  },
});

// Listener middleware must be prepended according to RTK docs:
// https://redux-toolkit.js.org/api/createListenerMiddleware#basic-usage
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const serviceMiddleware = (getDefaultMiddleware: Function) =>
  getDefaultMiddleware()
    .prepend(listenerMiddleware.middleware)
    .concat(
      promiseMiddleware,
      contentSourcesApi.middleware,
      imageBuilderApi.middleware,
      rhsmApi.middleware,
      provisioningApi.middleware,
      complianceApi.middleware,
      blueprintsReducer.middleware
    );

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const onPremMiddleware = (getDefaultMiddleware: Function) =>
  getDefaultMiddleware()
    .prepend(listenerMiddleware.middleware)
    .concat(
      promiseMiddleware,
      contentSourcesApi.middleware,
      imageBuilderApi.middleware,
      rhsmApi.middleware,
      blueprintsReducer.middleware
    );

const rootReducer = isOnPremise ? onPremReducer : serviceReducer;
const rootMiddleware = isOnPremise ? onPremMiddleware : serviceMiddleware;

export const store = configureStore({
  reducer: rootReducer,
  middleware: rootMiddleware,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
