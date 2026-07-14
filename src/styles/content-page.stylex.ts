import * as stylex from '@stylexjs/stylex';

export const contentPageStyles = stylex.create({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  card: {
    borderRadius: '0.5rem',
    backgroundColor: '#ffffff',
    padding: '1.5rem',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px -1px rgb(0 0 0 / 10%)',
  },
  contactCard: {
    borderRadius: '0.5rem',
    backgroundImage: 'linear-gradient(to right, #eff6ff, #faf5ff)',
    padding: '1.5rem',
  },
  pageTitle: {
    marginBottom: '1rem',
    color: '#111827',
    fontSize: '1.5rem',
    fontWeight: 700,
    lineHeight: '2rem',
  },
  sectionTitle: {
    marginBottom: '1rem',
    color: '#111827',
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: '1.75rem',
  },
  heading: {
    marginBottom: '0.75rem',
    color: '#374151',
    fontWeight: 500,
  },
  compactHeading: {
    color: '#374151',
    fontWeight: 500,
  },
  muted: {
    color: '#4b5563',
  },
  smallMuted: {
    color: '#4b5563',
    fontSize: '0.875rem',
  },
  small: {
    fontSize: '0.875rem',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 768px)': 'repeat(2, minmax(0, 1fr))',
    },
    gap: '1.5rem',
  },
  grid2Compact: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 768px)': 'repeat(2, minmax(0, 1fr))',
    },
    gap: '1rem',
  },
  grid3: {
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 768px)': 'repeat(2, minmax(0, 1fr))',
      '@media (min-width: 1024px)': 'repeat(3, minmax(0, 1fr))',
    },
    gap: '1.5rem',
  },
  stack1: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  stack2: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  stack3: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  stack4: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  wrapRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  featurePanel: {
    borderRadius: '0.5rem',
    backgroundColor: '#f9fafb',
    padding: '1rem',
  },
  featureTitle: {
    marginBottom: '0.5rem',
    color: '#374151',
    fontWeight: 500,
  },
  icon16: {
    width: '1rem',
    height: '1rem',
  },
  blue: { color: '#2563eb' },
  green: { color: '#16a34a' },
  purple: { color: '#9333ea' },
  red: { color: '#dc2626' },
  listDisc: {
    listStylePosition: 'inside',
    listStyleType: 'disc',
  },
  button: {
    display: 'flex',
    minHeight: '40px',
    cursor: 'pointer',
    alignItems: 'center',
    gap: '0.5rem',
    borderRadius: '0.375rem',
    backgroundColor: '#ffffff',
    paddingBlock: '0.5rem',
    paddingInline: '1rem',
    fontSize: '0.875rem',
    boxShadow: {
      default: '0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px -1px rgb(0 0 0 / 10%)',
      ':hover': '0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -2px rgb(0 0 0 / 10%)',
    },
    outline: {
      default: 'none',
      ':focus-visible': '2px solid #ff7f50',
    },
    outlineOffset: {
      default: null,
      ':focus-visible': '2px',
    },
  },
  outlineButton: {
    display: 'flex',
    minHeight: '40px',
    cursor: 'pointer',
    alignItems: 'center',
    gap: '0.5rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#d1d5db',
    borderRadius: '0.375rem',
    backgroundColor: {
      default: 'transparent',
      ':hover': '#f9fafb',
    },
    paddingBlock: '0.5rem',
    paddingInline: '0.75rem',
    fontSize: '0.875rem',
  },
  primaryButton: {
    minHeight: '40px',
    cursor: 'pointer',
    borderRadius: '0.375rem',
    backgroundColor: {
      default: '#2563eb',
      ':hover': '#1d4ed8',
    },
    paddingBlock: '0.5rem',
    paddingInline: '1rem',
    color: '#ffffff',
  },
  width56: { width: '14rem' },
  width64: { width: '16rem' },
});
