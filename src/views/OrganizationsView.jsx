import React from 'react';
import { SuperAdminView } from './SuperAdminView';

export const OrganizationsView = ({ user }) => {
  return <SuperAdminView user={user} />;
};

export default OrganizationsView;
