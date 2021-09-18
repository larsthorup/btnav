import React, {useEffect} from 'react';
import {connectingRelay} from '../service/relay';
import {useDispatch, useSelector} from '../state';

import {Text} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const RelayStatus = () => {
  const dispatch = useDispatch();
  const {
    deviceId,
    isConnecting,
    isDisconnected,
    isDiscovering,
    isOnline,
    isReady,
    isScanning,
  } = useSelector(state => state.relay);

  useEffect(() => {
    if (
      !(
        isScanning ||
        isConnecting ||
        isDisconnected ||
        isDiscovering ||
        isReady
      )
    ) {
      dispatch(connectingRelay());
    }
  }, [isConnecting, isDisconnected, isDiscovering, isReady, isScanning]);

  const relayStatusText = isReady
    ? 'Forbundet'
    : isScanning
    ? '...søger...'
    : isConnecting
    ? '...forbinder...'
    : isDiscovering
    ? '...kontrollerer...'
    : isDisconnected
    ? 'Afbrudt'
    : isOnline
    ? '...bluetooth...'
    : 'Bluetooth er slået fra';

  return (
    <Text
      style={{
        marginTop: 8,
        fontSize: 16,
        fontWeight: '400',
        color: Colors.dark,
      }}>
      {`Relæ: ${relayStatusText}`}
    </Text>
  );
};

export default RelayStatus;
