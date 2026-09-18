// Generated from messages/en/*.json — keep in sync when a namespace file is added or
// removed. Listed explicitly so the bundler can resolve the dynamic import in ./messages
// and so a missing namespace is a type error rather than a runtime surprise.
export const NAMESPACES = [
  'analytic',
  'assistentbot',
  'biography',
  'common',
  'coursedetails',
  'coursepicker',
  'createcourse',
  'design',
  'editcourse',
  'editcoursewrapper',
  'emailverify',
  'export',
  'feedbackdetails',
  'fillbiography',
  'forgetpassword',
  'history',
  'login',
  'managecourses',
  'manageusers',
  'nexuscoursedetails',
  'nexushistory',
  'nexususers',
  'oldevicemodal',
  'review',
  'settings',
  'setuppayment',
  'sidemenu',
  'support',
  'validation',
] as const;

export type Namespace = (typeof NAMESPACES)[number];
