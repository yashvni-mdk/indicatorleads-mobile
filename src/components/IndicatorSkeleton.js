import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {COLORS} from '../utils';

const IndicatorSkeleton = () => {
  return (
    <SkeletonPlaceholder
      alignItems={'center'}
      highlightColor={COLORS.lightPrimary1}
      backgroundColor={COLORS.lightPrimary2}>
      <SkeletonPlaceholder.Item
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}>
        <SkeletonPlaceholder.Item width={93} height={250} />
        <SkeletonPlaceholder.Item width={93} height={250} />
        <SkeletonPlaceholder.Item width={93} height={250} />
        <SkeletonPlaceholder.Item width={93} height={250} />
        <SkeletonPlaceholder.Item width={93} height={250} />
        <SkeletonPlaceholder.Item width={125} height={250} />
        <SkeletonPlaceholder.Item width={282} height={250} />
        <SkeletonPlaceholder.Item width={250} height={250} />
        <SkeletonPlaceholder.Item width={265} height={250} />
        <SkeletonPlaceholder.Item width={663} height={250} />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default IndicatorSkeleton;
