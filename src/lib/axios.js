// import axios from "axios";

// const axiosPublic = axios.create({
//   baseURL:
//     process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
//   withCredentials: true,
// });

// // Attach JWT token when available
// axiosPublic.interceptors.request.use(
//   (config) => {
//     if (typeof window !== "undefined") {
//       const token =
//         localStorage.getItem("token") ||
//         localStorage.getItem("accessToken");

//       if (token) {
//         config.headers = config.headers || {};
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Handle common authentication errors
// axiosPublic.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.warn("Unauthorized request.");
//     }

//     if (error.response?.status === 403) {
//       console.warn("Forbidden request.");
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosPublic;









// import axios from "axios";

// // Environment Variable এর শেষে /api না থাকলে তা স্বয়ংক্রিয়ভাবে যোগ করবে
// const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
// const baseURL = rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`;

// const axiosPublic = axios.create({
//   baseURL,
//   withCredentials: true,
// });

// // Attach JWT token when available
// axiosPublic.interceptors.request.use(
//   (config) => {
//     if (typeof window !== "undefined") {
//       const token =
//         localStorage.getItem("token") ||
//         localStorage.getItem("accessToken");

//       if (token) {
//         config.headers = config.headers || {};
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Handle common authentication errors
// axiosPublic.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.warn("Unauthorized request.");
//     }

//     if (error.response?.status === 403) {
//       console.warn("Forbidden request.");
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosPublic;







// import axios from "axios";

// // Base Server URL (শেষে স্ল্যাশ বা /api থাকলে তা স্বয়ংক্রিয়ভাবে সরিয়ে নেবে)
// const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
// const cleanBaseUrl = rawApiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");

// const axiosPublic = axios.create({
//   baseURL: cleanBaseUrl,
//   withCredentials: true,
// });

// // Interceptor: রিকোয়েস্ট পাঠানোর ঠিক আগে URL ফরম্যাট ঠিক করবে
// axiosPublic.interceptors.request.use(
//   (config) => {
//     // যদি রিকোয়েস্ট URL-এর শুরুতে /api না থাকে, তবে যুক্ত করে দেবে
//     if (config.url && !config.url.startsWith("/api") && !config.url.startsWith("http")) {
//       config.url = `/api${config.url.startsWith("/") ? "" : "/"}${config.url}`;
//     }

//     // JWT Token অটাচ করার লজিক
//     if (typeof window !== "undefined") {
//       const token =
//         localStorage.getItem("token") ||
//         localStorage.getItem("accessToken");

//       if (token) {
//         config.headers = config.headers || {};
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Handle common authentication errors
// axiosPublic.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.warn("Unauthorized request.");
//     }

//     if (error.response?.status === 403) {
//       console.warn("Forbidden request.");
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosPublic;







// import axios from "axios";

// // Base Server URL (শেষে স্ল্যাশ বা /api থাকলে তা স্বয়ংক্রিয়ভাবে সরিয়ে নেবে)
// const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
// const cleanBaseUrl = rawApiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");

// const axiosInstance = axios.create({
//   baseURL: cleanBaseUrl,
//   withCredentials: true,
// });

// // Interceptor: রিকোয়েস্ট পাঠানোর ঠিক আগে URL ফরম্যাট ঠিক করবে
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // যদি রিকোয়েস্ট URL-এর শুরুতে /api না থাকে, তবে যুক্ত করে দেবে
//     if (config.url && !config.url.startsWith("/api") && !config.url.startsWith("http")) {
//       config.url = `/api${config.url.startsWith("/") ? "" : "/"}${config.url}`;
//     }

//     // JWT Token অটাচ করার লজিক
//     if (typeof window !== "undefined") {
//       const token =
//         localStorage.getItem("token") ||
//         localStorage.getItem("accessToken");

//       if (token) {
//         config.headers = config.headers || {};
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Handle common authentication errors
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.warn("Unauthorized request.");
//     }

//     if (error.response?.status === 403) {
//       console.warn("Forbidden request.");
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;











import axios from "axios";

// =====================================================
// API BASE URL
// =====================================================

const rawApiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

// Remove trailing /api and slash
const cleanBaseUrl = rawApiUrl
  .replace(/\/api\/?$/, "")
  .replace(/\/$/, "");

// =====================================================
// AXIOS INSTANCE
// =====================================================

const axiosInstance =
  axios.create({
    baseURL: cleanBaseUrl,
    withCredentials: true,
  });

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

axiosInstance.interceptors.request.use(
  (config) => {
    // =================================================
    // Add /api automatically
    // =================================================

    if (
      config.url &&
      !config.url.startsWith("/api") &&
      !config.url.startsWith("http")
    ) {
      config.url =
        `/api${
          config.url.startsWith("/")
            ? ""
            : "/"
        }${config.url}`;
    }

    // =================================================
    // Get JWT from localStorage
    // =================================================

    if (
      typeof window !==
      "undefined"
    ) {
      const token =
        localStorage.getItem(
          "token"
        ) ||
        localStorage.getItem(
          "accessToken"
        );

      // =================================================
      // Attach Bearer token
      // =================================================

      if (token) {
        config.headers =
          config.headers || {};

        config.headers.Authorization =
          `Bearer ${token}`;
      }
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status ===
      401
    ) {
      console.warn(
        "Unauthorized request:",
        error.response?.data
          ?.message
      );
    }

    if (
      error.response?.status ===
      403
    ) {
      console.warn(
        "Forbidden request:",
        error.response?.data
          ?.message
      );
    }

    return Promise.reject(
      error
    );
  }
);

export default axiosInstance;