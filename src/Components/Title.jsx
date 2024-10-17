
export default function Title(props) {
  const { title } = props;
  const pathname = window.location.pathname.split('/')[1];

  return (
    <div className="page-titles">
      <ol className="breadcrumb">
        <li>
          <h5 className="bc-title">{title}</h5>
        </li>
        <Breadcrumb pathname={pathname} title={title}/>
      </ol>
    </div>
  );
}


const Breadcrumb = ({ pathname, title }) => {
  return (
    <>
      <li className="breadcrumb-item">
        <a href="/home">
          <i class="fa-solid fa-house" id="icon-theme-title" />
          Home
        </a>
      </li>
      {pathname === "home" ? (null) : (<li className="breadcrumb-item active">{title}</li>)}
    </>
  );
}