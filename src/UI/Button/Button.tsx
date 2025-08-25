export const Button = ({
  children,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="cursor-pointer border rounded px-3 py-1 bg-white text-sm hover:bg-gray-100"
    >
      {children}
    </button>
  );
};
