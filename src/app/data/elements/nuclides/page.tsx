import NuclidesPage from '@/components/data/NuclidesPage';

export const metadata = {
  title: 'Chart of Nuclides | MXWLL',
  description: 'Interactive chart of all known nuclides - every isotope of every element, mapped by protons and neutrons.',
};

export default function Page() {
  return <NuclidesPage />;
}