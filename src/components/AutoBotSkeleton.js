import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {COLORS} from '../utils';

const AutoBotSkeleton = () => {
  return (
    <SkeletonPlaceholder
      alignItems={'center'}
      highlightColor={COLORS.lightPrimary1}
      backgroundColor={COLORS.lightPrimary2}>
      <SkeletonPlaceholder.Item
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}>
        <SkeletonPlaceholder.Item width={93} height={1400} />
        <SkeletonPlaceholder.Item width={93} height={1400} />
        <SkeletonPlaceholder.Item width={93} height={1400} />
        <SkeletonPlaceholder.Item width={93} height={1400} />
        <SkeletonPlaceholder.Item width={93} height={1400} />
        <SkeletonPlaceholder.Item width={125} height={1400} />
        <SkeletonPlaceholder.Item width={282} height={1400} />
        <SkeletonPlaceholder.Item width={250} height={1400} />
        <SkeletonPlaceholder.Item width={265} height={1400} />
        <SkeletonPlaceholder.Item width={663} height={1400} />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default AutoBotSkeleton;
