import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {COLORS} from '../utils';

const SkeletonPlaceholderComponent = () => {
  return (
    <SkeletonPlaceholder
      alignItems={'center'}
      highlightColor={COLORS.lightPrimary1}
      backgroundColor={COLORS.lightPrimary2}>
      <SkeletonPlaceholder.Item
        flexDirection={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}>
        <SkeletonPlaceholder.Item width={130} height={100} />
        <SkeletonPlaceholder.Item width={110} height={100} />
        <SkeletonPlaceholder.Item width={110} height={100} />
        <SkeletonPlaceholder.Item width={125} height={100} />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default SkeletonPlaceholderComponent;
