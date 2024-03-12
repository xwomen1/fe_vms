/*
 * LoginPage Messages
 *
 * This contains all the text for the LoginPage component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'boilerplate.containers.LoginPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Welcome to Technopark',
  },
  username: {
    id: `${scope}.username`,
    defaultMessage: 'Username',
  },
  password: {
    id: `${scope}.password`,
    defaultMessage: 'Password',
  },
  submitText: {
    id: `${scope}.submitText`,
    defaultMessage: 'Sign In',
  },
  inputTextPlaceHolder: {
    id: `${scope}.inputText`,
    defaultMessage: 'Input text ...',
  },
  usernamePlaceHolder: {
    id: `${scope}.username.placeholder`,
    defaultMessage: 'Username *',
  },
  passwordPlaceHolder: {
    id: `${scope}.password.placeholder`,
    defaultMessage: 'Password *',
  },
  title: {
    id: `${scope}.title`,
    defaultMessage: ' CMS',
  },
  submitbtn: {
    id: `${scope}.submitbtn`,
    defaultMessage: 'LOGIN',
  },
  accountTypeTitle: {
    id: `${scope}.account.type.title`,
    defaultMessage: 'Account Type',
  },
  accountTypeLocal: {
    id: `${scope}.account.type.local`,
    defaultMessage: 'System (Local)',
  },
  accountTypeCustomer: {
    id: `${scope}.account.type.customer`,
    defaultMessage: 'customer',
  },
  accountTypeAD: {
    id: `${scope}.account.type.ad`,
    defaultMessage: 'AD',
  },
  linkForgotPassword: {
    id: `${scope}.link.forgotPassword`,
    defaultMessage: 'Forgot password?',
  },
  ForgotPasswordPageTitle: {
    id: `${scope}.ForgotPasswordPage.title`,
    defaultMessage: 'Forgot password',
  },
  ForgotPasswordPageContent: {
    id: `${scope}.ForgotPasswordPage.content`,
    defaultMessage:
      'Enter your registered email address to reissue your password',
  },
  ForgotPasswordPageInvalidEmail: {
    id: `${scope}.ForgotPasswordPage.invalid.email`,
    defaultMessage: 'Invalid format',
  },
  ForgotPasswordPageEmailTitle: {
    id: `${scope}.ForgotPasswordPage.emailTitle`,
    defaultMessage: 'Email',
  },
  ForgotPasswordPageSubmitbtn: {
    id: `${scope}.ForgotPasswordPage.submitbtn`,
    defaultMessage: 'Submit',
  },
  ForgotPasswordPageResendEmailPageContent: {
    id: `${scope}.ForgotPasswordPage.ResendEmailPage.content`,
    defaultMessage:
      'Request for reissue password has been sent to the email {email} address. Check your email to continue creating a new password. {br} If you do not receive an email, please choose Resend mail or contact the management for assistance. ',
  },
  ForgotPasswordPageResendEmailPageResendEmail: {
    id: `${scope}.ForgotPasswordPage.ResendEmailPage.resend.email`,
    defaultMessage: 'Resend mail.',
  },
  ForgotPasswordPageResendEmailPageResendRmailSuccessMessage: {
    id: `${scope}.ForgotPasswordPage.ResendEmailPage.resend.email.success.message`,
    defaultMessage: 'Email sent successfully',
  },
  ForgotPasswordPageResendEmailPageContiue: {
    id: `${scope}.ForgotPasswordPage.ResendEmailPage.continue`,
    defaultMessage: 'Continue',
  },
  InvalidLogin: {
    id: `${scope}.invalidLogin`,
    defaultMessage: 'The user name or password is incorrect',
  },
  FirstLoginFormTitle: {
    id: `${scope}.FirstLoginForm.Title`,
    // defaultMessage: 'Hãy đổi mật khẩu để tiếp tục sử dụng tính năng',
    defaultMessage: 'Please change your password to continue',
  },
  FirstLoginFormCurrentPassword: {
    id: `${scope}.FirstLoginForm.CurrentPassword`,
    // defaultMessage: 'Mật khẩu hiện tại',
    defaultMessage: 'Current password',
  },
  FirstLoginFormInvalidCurrentPassword: {
    id: `${scope}.FirstLoginForm.Invalid.CurrentPassword`,
    // defaultMessage: 'Mật khẩu hiện tại',
    defaultMessage: 'Current Password is incorrect',
  },
  changePasswordTitle: {
    id: `${scope}.Change.Password.Title`,
    defaultMessage: 'Creating a new password',
  },
  newPasswordLabel: {
    id: `${scope}.newPassword.label`,
    defaultMessage: 'New password',
  },
  confirmPasswordLabel: {
    id: `${scope}.confirmPassword.label`,
    defaultMessage: 'Confirm new password',
  },
  submitButton: {
    id: `${scope}.submit.button`,
    defaultMessage: 'Submit',
  },
  invalidNewPasswordFormat: {
    id: `${scope}.invalid.newPassword.format`,
    defaultMessage:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character and minimum eight characters!',
  },
  confirmPasswordNotMatch: {
    id: `${scope}.confirmPassword.notMatch`,
    defaultMessage:
      'The confirmation password does not match the new password!',
  },
  successMessage: {
    id: `${scope}.success.message`,
    defaultMessage: 'Password successfully updated',
  },
  changePasswordCodeLabel: {
    id: `${scope}.confirmationCode.label`,
    defaultMessage: 'Code',
  },
  changePasswordInvalidCode: {
    id: `${scope}.invalid.confirmationCode`,
    defaultMessage: 'Code is incorrect',
  },
});
