// The top-level keys of messages/en.json — keep in sync when a namespace is added or
// removed. Listed explicitly so client boundaries can pick namespaces by name and a
// misspelt one is a type error rather than a runtime surprise.
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
