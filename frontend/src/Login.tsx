//============================================
//? Import 
// ============================================

import { useState } from 'react';
import './Login.css';

import { useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from './shared/services/apiError';


// redux
import { useAppDispatch, useAppSelector } from './redux/hooks';

import { RootState } from './redux/reduxConfig'; // 

import { login } from './redux/actions/authAction';
import { startLoading, stopLoading, setError, clearError, clearSpecificError } from './redux/slices/authSlice';



// ==============================================
//   Types
// ==============================================

// shape of the form validation errors object
interface FormErrors {
  id?: string;
  password?: string;
  general?: string;
}

// ==============================================
//   Icons (inline, no external deps)
// ==============================================

// eye icon for password field
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
// -------------------------------
const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// ====================================================================
//?  Login Component
// ==================================================================== 
export default function Login() {

  const navigate = useNavigate();
  // State Management 
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);


  // using redux  ======================================================
  // set the state
  const dispatch = useAppDispatch();

  // read the state
  const user = useAppSelector((state) => state.auth);


  //=========================================================================
  // Validation 

  // setting the specific errors
  const validate = (): FormErrors => {

    const newErrors: FormErrors = {};

    if (!id) newErrors.id = 'Id is required.';
    if (!password) newErrors.password = 'Password is required.';
    return newErrors;
  };

  //=========================================================================
  /* ---- Submit ---- */

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // stop default form submission behaviour(which is refreshing the page)

    const validationErrors = validate();

    // if local validation error exists, show it below input box and stop submission
    if (Object.keys(validationErrors).length > 0) {
      dispatch(setError(validationErrors));

      return;
    }


    // clear previous errors and start loading spinner
    dispatch(clearError());
    dispatch(startLoading());


    //===========================================================
    // send api login request 
    try {
      const loggedInUser = await dispatch(login({ id, password }));
      const role = loggedInUser?.role;
      if (role === "admin") {
        navigate('/admin/dashboard');
      }
      else if (role === "student") {
        navigate('/student/homepage');
      }

      // ----------------------------------
    } catch (error) {
      const message = getApiErrorMessage(error);
      dispatch(setError(message));

    } finally {
      dispatch(stopLoading());
    }
  };

  //=========================================================================
  //=========================================================================

  return (
    <div className="login-page">
      {/* ===================== LEFT PANEL ===================== */}
      <section className="login-left">
        <div className="login-left-inner">

          {/* Logo */}
          <div className="login-logo" role="img">
            <img className="login-logo-icon" src="/logo.png" alt="Easy Learn logo" />
            <h1 className="login-logo-name">Easy Learn</h1>
            <p className="login-subtitle">Admin Login</p>
          </div>

          {/* General error */}
          {user.errors?.general && (
            <span className="field-error" role="alert" style={{ marginBottom: '12px' }}>
              {user.errors.general}
            </span>
          )}

          {/* Form ------------------------------------------------------------------ */}
          <form className="login-form" onSubmit={handleSubmit}>

            {/* Id Field */}
            <div className="field-group">
              <label className="field-label" htmlFor="login-Id">
                Id
              </label>
              <div className="field-input-wrapper">
                <input
                  id="login-Id"
                  type="text"
                  className={`field-input${user.errors?.id ? ' field-input--error' : ''}`}
                  placeholder="Enter your Id"
                  value={id}
                  // -----------
                  onChange={(event) => {
                    setId(event.target.value);

                    dispatch(clearSpecificError('id'));// clear specific field error (id) when user types

                    if (user.errors?.general) dispatch(clearSpecificError('general'));// clear general API errors on type

                  }}
                  // ------------------
                  autoComplete="id"
                />
              </div>
              {/* If local validation error exists, show it below input box */}
              {user.errors?.id && (
                <span id="id-error" className="field-error" role="alert">
                  {user.errors.id}
                </span>
              )}
            </div>

            {/* Password Field -------------------------------------- */}
            <div className="field-group">
              <label className="field-label" htmlFor="login-password">
                Password
              </label>
              <div className="field-input-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`field-input${user.errors?.password ? ' field-input--error' : ''}`}
                  placeholder="••••••••••••"
                  value={password}
                  // -----------
                  onChange={(event) => {
                    setPassword(event.target.value);

                    dispatch(clearSpecificError('password'));// clear specific field error when user types

                    if (user.errors?.general) dispatch(clearSpecificError('general'));// clear general API errors on type

                  }}
                  // -----------------
                  autoComplete="current-password"
                  style={{ paddingRight: '44px' }}
                />

                {/* ---------------------------------------------------------------------------------- */}
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>

              </div>


              {/* If local validation error exists, show it below input box -----------------------------*/}
              {user.errors?.password && (
                <span id="password-error" className="field-error" role="alert">
                  {user.errors.password}
                </span>
              )}
            </div>

            {/* ======================================================================= */}
            {/* Sign In Button */}
            <button
              id="login-submit"
              type="submit"
              className={`btn-signin${user.isLoading ? ' loading' : ''}`}
              disabled={user.isLoading}
            >
              {user.isLoading ? <span className="btn-spinner" /> : 'Sign In'}
            </button>


          </form>

        </div>{/* end .login-left-inner */}
      </section>

      {/* ===================== RIGHT PANEL ===================== */}
      <section className="login-right">
        <img
          src="/neu.png"
          alt="Near East University"
          className="login-right-image"
        />
        <div className="login-right-overlay" />
        <div className="login-right-quote">
          <blockquote>
            &ldquo;Education is the passport to the future, for tomorrow belongs to those who prepare for it today.&rdquo;
          </blockquote>
          <div className="login-right-quote-source">
            <span className="login-right-quote-source-line" />
            <span className="login-right-quote-source-text">Malcolm X</span>
          </div>
        </div>
      </section>
    </div>
  );
}
