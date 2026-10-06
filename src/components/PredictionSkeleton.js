import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {COLORS} from '../utils';

const PredictionSkeleton = () => {
  return (
    <SkeletonPlaceholder alignItems={'center'}>
      <SkeletonPlaceholder.Item
        justifyContent={'space-between'}
        alignItems={'center'}>
        <SkeletonPlaceholder.Item width={120} height={110} />
        <SkeletonPlaceholder.Item width={120} height={110} />
        <SkeletonPlaceholder.Item width={120} height={110} />
        <SkeletonPlaceholder.Item width={120} height={110} />
        <SkeletonPlaceholder.Item width={120} height={110} />
        <SkeletonPlaceholder.Item width={120} height={110} />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default PredictionSkeleton;
