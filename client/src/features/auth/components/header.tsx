type AuthHeaderProps = {
  title: string;
  description: string;
};

export const Header = ({ title, description }: AuthHeaderProps) => {
  return (
    <>
      <div className="text-center space-y-1">
        <h3 className="text-2xl">{title}</h3>
        <div className="text-muted-foreground text-sm">{description}</div>
      </div>
    </>
  );
};
