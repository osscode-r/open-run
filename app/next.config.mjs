// import MillionLint from '@million/lint';
/** @type {import('next').NextConfig} */
import million from "million/compiler";
const nextConfig = {
};
// export default MillionLint.next({
//   rsc: true
// })(million.next(nextConfig));
export default million.next(nextConfig);