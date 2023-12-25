import { useRouteError,  useNavigate } from "react-router-dom"

const Error = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div className="error">
      <h1>Uh oh! We’ve got a problem.</h1>
      <p>{error.message || error.statusText}</p>
      <div className="flex-md">
        <button style={{ marginRight: 15 }}
          className="btn btn--dark"
          onClick={() => navigate(-1)}
        >
          <span>Go Back</span>
        </button>
        <button
          onClick={() => navigate('/home')}
          className="btn btn--dark"
        >
          <span>Go home</span>
        </button>
      </div>
    </div>
  )
}
export default Error