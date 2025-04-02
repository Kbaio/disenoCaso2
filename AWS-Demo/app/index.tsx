import React from 'react';
import { View, Text, Button } from 'react-native';
import { Amplify } from 'aws-amplify';
import awsconfig from './Services/AWS/aws-exports';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react-native';

Amplify.configure(awsconfig);

export default function App() {
  return (
    <Authenticator.Provider>
      <Authenticator>
        <AppContent />
      </Authenticator>
    </Authenticator.Provider>
  );
}

function AppContent() {
  const { signOut, user } = useAuthenticator();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome, {user?.username}!</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}