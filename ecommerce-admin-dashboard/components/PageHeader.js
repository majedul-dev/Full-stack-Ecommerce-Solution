import Link from "next/link";

const PageHeader = ({ title, actionText, actionHref, actionOnClick, isButton = false, Icon }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {isButton ? (
        <button
          onClick={actionOnClick}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {Icon && <Icon className="h-5 w-5 mr-2" />}
          {actionText}
        </button>
      ) : (
        <Link
          href={actionHref}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {Icon && <Icon className="h-5 w-5 mr-2" />}
          {actionText}
        </Link>
      )}
    </div>
  );
};

export default PageHeader;
