import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {COLORS} from '../utils';

const LossSkeleton = () => {
  return (
    <SkeletonPlaceholder alignItems={'center'}>
      <SkeletonPlaceholder.Item
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}>
        <SkeletonPlaceholder.Item width={120} height={330} />
        <SkeletonPlaceholder.Item width={120} height={330} />
        <SkeletonPlaceholder.Item width={120} height={330} />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default LossSkeleton;
