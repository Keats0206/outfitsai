import SignUpButton from "@/components/SignUpButton";

interface HeaderSectionProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

const HeaderSection = ({ title, subtitle, children }: HeaderSectionProps) => {
    return (
      <div className='flex flex-col items-center my-24'>
        <h1 className="text-5xl font-bold mb-4 text-2">{title}</h1>
        <h2 className="text-2xl mb-6 text-center max-w-4xl">{subtitle}</h2>
        <div className="mb-8">
          <SignUpButton />
        </div>
      </div>
    );
};

export default HeaderSection;