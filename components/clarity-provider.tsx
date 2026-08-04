'use client';

import { useEffect } from 'react';
import clarity from '@microsoft/clarity';

export default function ClarityProvider() {
  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
    // .env.example ships a placeholder value; initialising with it makes
    // clarity.ms 400 on every page load and shows up as a console error in
    // Lighthouse. Treat it as "not configured".
    if (projectId && projectId !== 'your-clarity-project-id') {
      clarity.init(projectId);
    }
  }, []);

  return null;
}
