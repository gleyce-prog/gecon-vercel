
export default function Title(props) {
  const { title, pathname } = props;
  return (
    <div className="page-titles">
      <ol className="breadcrumb">
        <li>
          <h5 className="bc-title">{title}</h5>
        </li>
        <li className="breadcrumb-item">
          <a href="/painel/home">
            <svg
              width="17"
              height="17"
              viewBox="0 0 17 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.125 6.375L8.5 1.41667L14.875 6.375V14.1667C14.875 14.5424 14.7257 14.9027 14.4601 15.1684C14.1944 15.4341 13.8341 15.5833 13.4583 15.5833H3.54167C3.16594 15.5833 2.80561 15.4341 2.53993 15.1684C2.27426 14.9027 2.125 14.5424 2.125 14.1667V6.375Z"
                stroke="#2C2C2C"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M6.375 15.5833V8.5H10.625V15.5833"
                stroke="#2C2C2C"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            Home
          </a>
        </li>
        {pathname === "home" ? (null) : (<li className="breadcrumb-item active">{pathname}</li>)}

      </ol>
    </div>
  );
}
