// import { Global, ThemeProvider, css, useTheme } from '@emotion/react'
// import themes, { TTheme, TThemesUnion } from '.'
// import { PropsWithChildren } from 'react'

// const GlobalStyles = () => {
//   const theme = useTheme()

//   return (
//     <Global
//       styles={css`
//         html,
//         body {
          
//         }

//         body {
//           margin: 0;
//           padding: 0;
//           -webkit-text-size-adjust: none;
//         }

//         #__next {
//           display: flex;
//           flex-direction: column;
//           width: 100%;
//           height: 100%;
//         }

//         *,
//         *:before,
//         *:after {
//           box-sizing: border-box;
//         }

//         /* scrollbar*/
//         /* for Firefox */
//         * {
//           /* scrollbar-width: thin; */
//           scrollbar-color: transparent;
//         }

//         /* for Chrome, Edge, and Safari */
//         *::-webkit-scrollbar {
//           width: 0;
//           height: 0;
//           display: none;
//         }

//         *::-webkit-scrollbar-track {
//           background: none;
//           display: none;
//         }

//         *::-webkit-scrollbar-thumb {
//           border-radius: 2px;
//           display: none;
//         }

//         form,
//         fieldset {
//           margin: 0;
//           padding: 0;
//           border: 0;
//         }

//         input,
//         textarea,
//         select {
//           border-radius: 10px;
//           -webkit-appearance: 'none';
//           box-shadow: none;
//           width: 100%;
//           display: block;
//         }
//         button {
//           margin: 0;
//           outline: none;
//           border: none;
//           background-color: transparent;
//           cursor: pointer;
//         }

//         input::-ms-clear {
//           display: none;
//         }

//         input[type='search']::-webkit-search-decoration,
//         input[type='search']::-webkit-search-cancel-button,
//         input[type='search']::-webkit-search-results-button,
//         input[type='search']::-webkit-search-results-decoration {
//           display: none;
//         }

//         input[type='number']::-webkit-inner-spin-button,
//         input[type='number']::-webkit-outer-spin-button {
//           -webkit-appearance: none;
//           margin: 0;
//         }

//         /* Для Firefox */
//         input[type='number'] {
//           -moz-appearance: textfield;
//         }

//         input[type='number']::-ms-clear,
//         input[type='number']::-ms-reveal {
//           display: none;
//         }

//         button::-moz-focus-inner {
//           border: 0;
//         }

//         textarea {
//           resize: none;
//         }

//         [placeholder] {
//           text-overflow: ellipsis;
//         }

//         header,
//         nav,
//         section,
//         article,
//         aside,
//         footer,
//         menu,
//         time,
//         figure,
//         figcaption,
//         main {
//           width: calc(100vw);
//           display: block;
//         }

//         img,
//         svg,
//         picture {
//           border: 0;
//           vertical-align: top;
//         }

//         a {
//           ${theme.baseStyle.a};
//         }

//         h2 {
//           margin: 0;
//           padding: 0;
//           font-size: 18px;
//         }

//         .Toastify__toast {
//           padding: 0;
//           box-shadow: none;
//           background: none;
//           overflow: visible;
//         }

//         .Toastify__close-button {
//           display: none;
//         }

//         .Toastify__toast-container {
//           padding: 0;
//         }

//         @keyframes anvil {
//           0% {
//             transform: scale(1) translateY(0px);
//             opacity: 0;
//             box-shadow: 0 0 0 rgba(241, 241, 241, 0);
//           }
//           1% {
//             transform: scale(0.96) translateY(10px);
//             opacity: 0;
//             box-shadow: 0 0 0 rgba(241, 241, 241, 0);
//           }
//           100% {
//             transform: scale(1) translateY(0px);
//             opacity: 1;
//             box-shadow: 0 0 500px rgba(241, 241, 241, 0);
//           }
//         }
//         .popup-content {
//           border-radius: 10px;
//           padding: 8px 16px;
//           -webkit-animation: anvil 0.3s cubic-bezier(0.38, 0.1, 0.36, 0.9) forwards;
//           margin-top: 2px;
//           background: rgba(255, 255, 255, 0.8);
//           border: 1px solid rgba(255, 255, 255, 0.08);
//           backdrop-filter: blur(50px);
//         }

//         [role='dialog'].popup-content {
//           padding: 0;
//           border: none;
//           width: fit-content;
//         }

//         [role='tooltip'].popup-content {
//           border-radius: 10px;
//         }
//       `}
//     />
//   )
// }

// type ThemeProps = PropsWithChildren<{ theme: TThemesUnion }>

// const getTheme = (t: TThemesUnion): TTheme => themes[t]

// const CustomThemeProvider = ({ theme, children }: ThemeProps) => {
//   const currentTheme = getTheme(theme)

//   return (
//     <ThemeProvider theme={currentTheme}>
//       <>
//         <GlobalStyles />
//         {children}
//       </>
//     </ThemeProvider>
//   )
// }

// CustomThemeProvider.defaultProps = {
//   theme: 'dark' as TThemesUnion,
// }

// export default CustomThemeProvider
