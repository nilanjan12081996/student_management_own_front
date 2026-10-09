import {
  initialMockUsers,
  initialMockQuizzes,
  initialMockNotes,
  initialMockOrganizations,
  initialMockBatches,
  initialMockSubmissions,
  initialMockTuitionPasses
} from "./mockData";

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Auto-handle FormData vs JSON
    if (config.data instanceof FormData) {
      // Let axios automatically set the correct Content-Type with boundary
      delete config.headers["Content-Type"];
    } else if (!config.headers["Content-Type"]) {
      // Default to application/json if not explicitly set
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Remove token if 401 Unauthorized
      localStorage.removeItem("token");
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);


// ======================================================
// DEVICE ID
// ======================================================

export const getDeviceId = () => {
  try {
    let id =
      localStorage.getItem(
        "eduadmin_device_id"
      );

    if (!id) {
      id =
        "dev_" +
        Math.random()
          .toString(36)
          .substring(2, 9) +
        "_" +
        Date.now().toString(36);

      localStorage.setItem(
        "eduadmin_device_id",
        id
      );
    }

    return id;

  } catch {
    return "dev_browser_default";
  }
};


// ======================================================
// LOCAL STORAGE KEYS
// ======================================================

const LS_KEYS = {

  USERS:
    "eduadmin_mock_users",

  QUIZZES:
    "eduadmin_mock_quizzes",

  NOTES:
    "eduadmin_mock_notes",

  ORGANIZATIONS:
    "eduadmin_mock_organizations",

  BATCHES:
    "eduadmin_mock_batches",

  SUBMISSIONS:
    "eduadmin_mock_submissions",

  TUITION_PASSES:
    "eduadmin_mock_tuition_passes",

  MODE:
    "eduadmin_api_mode"

};


// ======================================================
// LOCAL STORAGE HELPERS
// ======================================================

const getStoredData = (
  key,
  defaultData
) => {

  try {

    const data =
      localStorage.getItem(key);

    if (!data) {

      localStorage.setItem(
        key,
        JSON.stringify(defaultData)
      );

      return defaultData;
    }

    return JSON.parse(data);

  } catch {

    return defaultData;
  }
};


const setStoredData = (
  key,
  data
) => {

  try {

    localStorage.setItem(
      key,
      JSON.stringify(data)
    );

  } catch (err) {

    console.error(
      "Storage error:",
      err
    );
  }
};


// ======================================================
// API SERVICE
// ======================================================

class ApiService {

  constructor() {

    this.isLiveAvailable = false;

    this.forceMock =
      localStorage.getItem(
        LS_KEYS.MODE
      ) === "mock";
  }


  // ====================================================
  // API MODE
  // ====================================================

  setMode(mode) {

    this.forceMock =
      mode === "mock";

    localStorage.setItem(
      LS_KEYS.MODE,
      mode
    );
  }


  getMode() {

    return this.forceMock
      ? "mock"
      : "live";
  }


  // ====================================================
  // HEALTH CHECK
  // ====================================================

  async checkHealth() {
    try {
      const startTime = performance.now();
      await apiClient.get('/health');
      const latency = Math.round(performance.now() - startTime);

      this.isLiveAvailable = true;
      return {
        online: true,
        latency
      };
    } catch {
      this.isLiveAvailable = false;
      return {
        online: false,
        latency: null
      };
    }
  }


  // ====================================================
  // GENERIC REQUEST
  // ====================================================

  async request(endpoint, options = {}) {
    if (this.forceMock) {
      throw new Error("MOCK_MODE");
    }

    try {
      const axiosConfig = {
        url: endpoint,
        method: options.method || "GET",
        headers: options.headers || {},
        ...options
      };

      // Map fetch's `body` to axios's `data`
      if (options.body) {
        axiosConfig.data = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
        delete axiosConfig.body;
      }

      const res = await apiClient.request(axiosConfig);

      this.isLiveAvailable = true;
      return res.data;

    } catch (err) {
      if (
        err.message === "Network Error" ||
        err.code === "ECONNABORTED" ||
        err.message === "Failed to fetch" ||
        err.message === "NetworkError when attempting to fetch resource"
      ) {
        this.isLiveAvailable = false;
      }

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        `API Error: ${err.response?.statusText || "Unknown error"}`;

      throw new Error(errorMessage);
    }
  }


  // ======================================================
  // ORGANIZATIONS / TENANTS API
  // ======================================================

  async getAllOrganizations() {

    try {

      if (!this.forceMock) {

        const res =
          await this.request(
            "/organizations"
          );

        return (
          res.organizations ||
          res
        );
      }

    } catch (err) {

      console.warn(
        "Using mock organizations fallback:",
        err.message
      );
    }

    return getStoredData(
      LS_KEYS.ORGANIZATIONS,
      initialMockOrganizations
    );
  }


  async createOrganization(
    orgData
  ) {

    try {

      if (!this.forceMock) {

        const res =
          await this.request(
            "/organizations/create",
            {
              method: "POST",

              body:
                JSON.stringify(
                  orgData
                )
            }
          );

        return (
          res.organization ||
          res
        );
      }

    } catch (err) {

      console.warn(
        "Using mock createOrganization fallback:",
        err.message
      );
    }


    const currentOrgs =
      getStoredData(
        LS_KEYS.ORGANIZATIONS,
        initialMockOrganizations
      );


    const newOrg = {

      id: Date.now(),

      name:
        orgData.name,

      slug:
        orgData.name
          .toLowerCase()
          .replace(
            /[^a-z0-9]+/g,
            "-"
          ),

      owner_name:
        orgData.owner_name ||
        "Tutor Admin",

      email:
        orgData.email,

      plan:
        orgData.plan ||
        "pro",

      status:
        "active",

      student_count:
        0,

      createdAt:
        new Date().toISOString()
    };


    const updated = [
      newOrg,
      ...currentOrgs
    ];


    setStoredData(
      LS_KEYS.ORGANIZATIONS,
      updated
    );


    // Automatically create Tutor Admin User
    const currentUsers =
      getStoredData(
        LS_KEYS.USERS,
        initialMockUsers
      );


    const newTutorUser = {

      id:
        Date.now() + 1,

      name:
        orgData.owner_name ||
        "Tutor Admin",

      email:
        orgData.email,

      role:
        "admin",

      organization_id:
        newOrg.id,

      class:
        "Faculty Admin",

      semester:
        "Staff",

      course:
        `${newOrg.name} Owner`,

      status:
        "active",

      tuition_code:
        null,

      createdAt:
        new Date().toISOString()
    };


    setStoredData(
      LS_KEYS.USERS,
      [
        newTutorUser,
        ...currentUsers
      ]
    );


    return newOrg;
  }


  async updateOrganization(
    id,
    orgData
  ) {

    const currentOrgs =
      getStoredData(
        LS_KEYS.ORGANIZATIONS,
        initialMockOrganizations
      );


    const updated =
      currentOrgs.map(
        o =>
          o.id === Number(id) ||
          o.id === id
            ? {
                ...o,
                ...orgData
              }
            : o
      );


    setStoredData(
      LS_KEYS.ORGANIZATIONS,
      updated
    );


    return {
      message:
        "Organization updated successfully"
    };
  }


  // ======================================================
  // BATCHES API
  // ======================================================

  async getBatchesByOrganization(
    orgId
  ) {

    const allBatches =
      getStoredData(
        LS_KEYS.BATCHES,
        initialMockBatches
      );


    if (!orgId) {
      return allBatches;
    }


    return allBatches.filter(
      b =>
        b.organization_id ===
          Number(orgId) ||
        b.organization_id ===
          orgId
    );
  }


  async createBatch(
    batchData
  ) {

    const currentBatches =
      getStoredData(
        LS_KEYS.BATCHES,
        initialMockBatches
      );


    const newBatch = {

      id:
        Date.now(),

      organization_id:
        Number(
          batchData.organization_id
        ) || 1,

      name:
        batchData.name,

      subject:
        batchData.subject ||
        "General Subject",

      join_code:
        `${batchData.name
          .substring(0, 3)
          .toUpperCase()}-${Math.floor(
          1000 +
            Math.random() *
              9000
        )}`,

      student_count:
        0,

      createdAt:
        new Date().toISOString()
    };


    const updated = [
      newBatch,
      ...currentBatches
    ];


    setStoredData(
      LS_KEYS.BATCHES,
      updated
    );


    return newBatch;
  }


  // ======================================================
  // SUBMISSIONS & GRADING
  // ======================================================

  async getAllSubmissions(
    orgId
  ) {

    const currentSubmissions =
      getStoredData(
        LS_KEYS.SUBMISSIONS,
        initialMockSubmissions
      );


    if (!orgId) {
      return currentSubmissions;
    }


    return currentSubmissions.filter(
      s =>
        s.organization_id ===
          Number(orgId) ||
        s.organization_id ===
          orgId
    );
  }


  async submitQuizAttempt(
    attemptData
  ) {

    const currentSubmissions =
      getStoredData(
        LS_KEYS.SUBMISSIONS,
        initialMockSubmissions
      );


    const newSubmission = {

      id:
        Date.now(),

      organization_id:
        Number(
          attemptData.organization_id
        ) || 1,

      quiz_id:
        Number(
          attemptData.quiz_id
        ),

      user_id:
        Number(
          attemptData.user_id
        ),

      student_name:
        attemptData.student_name ||
        "Student User",

      quiz_title:
        attemptData.quiz_title ||
        "Quiz Assessment",

      score:
        Number(
          attemptData.score
        ) || 0,

      total_marks:
        Number(
          attemptData.total_marks
        ) || 10,

      answers_json:
        JSON.stringify(
          attemptData.answers ||
          {}
        ),

      feedback:
        attemptData.feedback ||
        "Automated attempt logged.",

      graded_at:
        new Date().toISOString(),

      createdAt:
        new Date().toISOString()
    };


    const updated = [
      newSubmission,
      ...currentSubmissions
    ];


    setStoredData(
      LS_KEYS.SUBMISSIONS,
      updated
    );


    return newSubmission;
  }


  async gradeSubmission(
    id,
    feedbackData
  ) {

    const currentSubmissions =
      getStoredData(
        LS_KEYS.SUBMISSIONS,
        initialMockSubmissions
      );


    const updated =
      currentSubmissions.map(
        s => {

          if (
            s.id === Number(id) ||
            s.id === id
          ) {

            return {

              ...s,

              score:
                feedbackData.score !==
                undefined
                  ? Number(
                      feedbackData.score
                    )
                  : s.score,

              feedback:
                feedbackData.feedback !==
                undefined
                  ? feedbackData.feedback
                  : s.feedback,

              graded_at:
                new Date().toISOString()
            };
          }

          return s;
        }
      );


    setStoredData(
      LS_KEYS.SUBMISSIONS,
      updated
    );


    return {
      message:
        "Submission graded successfully"
    };
  }


  // ======================================================
  // USERS API
  // ======================================================

  async getAllUsers(
    orgId
  ) {

    try {

      if (!this.forceMock) {

        const users =
          await this.request(
            "/users/getAll"
          );


        const list =
          Array.isArray(users)
            ? users
            : (
                users.users ||
                []
              );


        if (!orgId) {
          return list;
        }


        return list.filter(
          u =>
            u.organization_id ===
              Number(orgId) ||
            u.organization_id ===
              orgId
        );
      }

    } catch (err) {

      console.warn(
        "Using mock users fallback:",
        err.message
      );
    }


    const currentUsers =
      getStoredData(
        LS_KEYS.USERS,
        initialMockUsers
      );


    if (!orgId) {
      return currentUsers;
    }


    return currentUsers.filter(
      u =>
        u.organization_id ===
          Number(orgId) ||
        u.organization_id ===
          orgId
    );
  }


  // ======================================================
  // CREATE USER / REGISTER
  // ======================================================

  async createUser(
    userData
  ) {

    try {

      if (!this.forceMock) {

        const res =
          await this.request(
            "/users/create",
            {
              method: "POST",

              body:
                JSON.stringify(
                  userData
                )
            }
          );


        return (
          res.user ||
          res
        );
      }

    } catch (err) {

      console.warn(
        "Using mock createUser fallback:",
        err.message
      );
    }


    // ==================================================
    // MOCK CREATE USER
    // ==================================================

    const currentUsers =
      getStoredData(
        LS_KEYS.USERS,
        initialMockUsers
      );


    const email =
      userData.email
        ?.trim()
        .toLowerCase();


    const existingUser =
      currentUsers.find(
        u =>
          u.email
            ?.toLowerCase() ===
          email
      );


    if (existingUser) {

      throw new Error(
        "Email already exists"
      );
    }


    /*
     * Public registration is always
     * a pending student.
     *
     * Admin-side enrollment can use
     * adminEnrollment=true.
     */

    const isAdminEnrollment =
      userData.adminEnrollment ===
      true;


    const userRole =
      isAdminEnrollment
        ? (
            userData.role ||
            "student"
          )
        : "student";


    const userStatus =
      userRole === "student" &&
      !isAdminEnrollment
        ? "pending"
        : "active";


    const newUser = {

      id:
        Date.now(),

      name:
        userData.name,

      email:
        email,

      role:
        userRole,

      organization_id:
        Number(
          userData.organization_id
        ) || 1,

      class:
        userData.studentClass ||
        userData.class ||
        null,

      semester:
        userData.semester ||
        null,

      course:
        userData.course ||
        null,

      status:
        userStatus,

      tuition_code:
        null,

      active_device_id:
        isAdminEnrollment
          ? (
              userData.deviceId ||
              null
            )
          : null,

      last_active_at:
        null,

      createdAt:
        new Date().toISOString()
    };


    const updatedUsers = [
      newUser,
      ...currentUsers
    ];


    setStoredData(
      LS_KEYS.USERS,
      updatedUsers
    );


    return newUser;
  }


  // ======================================================
  // UPDATE USER
  // ======================================================

  async updateUser(
    id,
    userData
  ) {

    try {

      if (!this.forceMock) {

        const res =
          await this.request(
            `/users/update/${id}`,
            {
              method: "PUT",

              body:
                JSON.stringify(
                  userData
                )
            }
          );


        return res;
      }

    } catch (err) {

      console.warn(
        "Using mock updateUser fallback:",
        err.message
      );
    }


    const currentUsers =
      getStoredData(
        LS_KEYS.USERS,
        initialMockUsers
      );


    const updated =
      currentUsers.map(
        u => {

          if (
            u.id === Number(id) ||
            u.id === id
          ) {

            return {

              ...u,

              ...userData,

              class:
                userData.studentClass ||
                userData.class ||
                u.class
            };
          }


          return u;
        }
      );


    setStoredData(
      LS_KEYS.USERS,
      updated
    );


    return {
      message:
        "User updated successfully"
    };
  }


  // ======================================================
  // DELETE USER
  // ======================================================

  async deleteUser(
    id
  ) {

    try {

      if (!this.forceMock) {

        return await this.request(
          `/users/delete/${id}`,
          {
            method: "DELETE"
          }
        );
      }

    } catch (err) {

      console.warn(
        "Using mock deleteUser fallback:",
        err.message
      );
    }


    const currentUsers =
      getStoredData(
        LS_KEYS.USERS,
        initialMockUsers
      );


    const updated =
      currentUsers.filter(
        u =>
          u.id !== Number(id) &&
          u.id !== id
      );


    setStoredData(
      LS_KEYS.USERS,
      updated
    );


    return {
      message:
        "User deleted successfully"
    };
  }


  // ======================================================
  // LOGIN
  // ======================================================

  async loginUser(
    credentials
  ) {

    try {

      if (!this.forceMock) {

        return await this.request(
          "/users/login",
          {
            method: "POST",

            body:
              JSON.stringify(
                credentials
              )
          }
        );
      }

    } catch (err) {

      console.warn(
        "Using mock login fallback:",
        err.message
      );
    }


    const currentUsers =
      getStoredData(
        LS_KEYS.USERS,
        initialMockUsers
      );


    const email =
      credentials.email
        ?.trim()
        .toLowerCase();


    const user =
      currentUsers.find(
        u =>
          u.email
            ?.toLowerCase() ===
          email
      );


    if (!user) {

      throw new Error(
        "Invalid email or password"
      );
    }


    // --------------------------------------------------
    // PENDING STUDENT
    // --------------------------------------------------

    if (
      user.role === "student" &&
      user.status === "pending"
    ) {

      throw new Error(
        "Your account is awaiting approval. Your tutor must issue a Tuition Pass before you can login."
      );
    }


    // --------------------------------------------------
    // SUSPENDED
    // --------------------------------------------------

    if (
      user.status ===
      "suspended"
    ) {

      throw new Error(
        "Your tuition access has been suspended by your tutor. Please contact your instructor."
      );
    }


    // --------------------------------------------------
    // INACTIVE
    // --------------------------------------------------

    if (
      user.status ===
      "inactive"
    ) {

      throw new Error(
        "Your tuition account is currently inactive."
      );
    }


    // --------------------------------------------------
    // DEVICE
    // --------------------------------------------------

    const deviceId =
      credentials.deviceId ||
      getDeviceId();


    user.active_device_id =
      deviceId;


    user.last_active_at =
      new Date().toISOString();


    const updatedUsers =
      currentUsers.map(
        u =>
          u.id === user.id
            ? user
            : u
      );


    setStoredData(
      LS_KEYS.USERS,
      updatedUsers
    );


    return {

      message:
        "Login successful",

      user
    };
  }


  // ======================================================
  // TUITION PASSES
  // ======================================================

  async getAllTuitionPasses(
    orgId
  ) {

    try {

      if (!this.forceMock) {

        const query =
          orgId
            ? `?organization_id=${encodeURIComponent(
                orgId
              )}`
            : "";


        /*
         * IMPORTANT:
         * Backend route is:
         * /getAllTuitionPass
         */

        const res =
          await this.request(
            `/tuition-passes/getAllTuitionPass${query}`
          );


        const passes =
          Array.isArray(res)
            ? res
            : (
                res.passes ||
                []
              );


        return passes.map(
          p => ({

            ...p,

            id:
              p.id ??
              p.student_id,

            code:
              p.code ??
              p.tuition_code,

            tuition_code:
              p.tuition_code ??
              p.code,

            student_id:
              p.student_id ??
              p.id,

            is_redeemed:
              p.is_redeemed !==
              undefined
                ? p.is_redeemed
                : false,

            redeemed_by:
              p.redeemed_by ??
              null,

            redeemed_at:
              p.redeemed_at ??
              null,

            createdAt:
              p.createdAt ??
              null
          })
        );
      }

    } catch (err) {

      console.warn(
        "Using mock tuition passes fallback:",
        err.message
      );
    }


    // MOCK MODE

    const passes =
      getStoredData(
        LS_KEYS.TUITION_PASSES,
        initialMockTuitionPasses
      );


    if (!orgId) {
      return passes;
    }


    return passes.filter(
      p =>
        p.organization_id ===
          Number(orgId) ||
        p.organization_id ===
          orgId
    );
  }


  // ======================================================
  // VALIDATE TUITION PASS
  // ======================================================

  async validateTuitionPass(
    code
  ) {

    if (
      !code ||
      !code.trim()
    ) {

      throw new Error(
        "Tuition enrollment code is required."
      );
    }


    const clean =
      code
        .trim()
        .toUpperCase();


    const passes =
      getStoredData(
        LS_KEYS.TUITION_PASSES,
        initialMockTuitionPasses
      );


    const pass =
      passes.find(
        p =>
          (
            p.code ||
            p.tuition_code
          )
            ?.toUpperCase() ===
          clean
      );


    if (!pass) {

      throw new Error(
        "Invalid tuition pass code. Only enrolled students with an active pass from the tutor can register."
      );
    }


    if (
      pass.is_single_use &&
      pass.is_redeemed
    ) {

      throw new Error(
        `This tuition pass has already been claimed by ${
          pass.redeemed_by ||
          "another student"
        }. Codes cannot be shared.`
      );
    }


    if (
      pass.expires_at &&
      new Date(
        pass.expires_at
      ) < new Date()
    ) {

      throw new Error(
        "This tuition pass has expired. Please request a new pass from your tutor."
      );
    }


    return {

      valid:
        true,

      pass
    };
  }


  // ======================================================
  // CREATE / ISSUE TUITION PASS
  // ======================================================

  async createTuitionPass(
    passData
  ) {

    // ==================================================
    // LIVE BACKEND
    // ==================================================

    try {

      if (!this.forceMock) {

        /*
         * IMPORTANT:
         * Backend route is:
         *
         * /tuition-passes/createTuitionPass
         */

        const res =
          await this.request(
            "/tuition-passes/createTuitionPass",
            {
              method: "POST",

              body:
                JSON.stringify({

                  student_id:
                    passData.student_id ||
                    passData.studentId ||
                    undefined,

                  student_email:
                    passData.student_email ||
                    passData.studentEmail ||
                    undefined,

                  organization_id:
                    passData.organization_id ||
                    undefined,

                  batch_name:
                    passData.batch_name ||
                    passData.batchName ||
                    undefined,

                  expires_at:
                    passData.expires_at ||
                    passData.expiresAt ||
                    undefined,

                  is_single_use:
                    passData.is_single_use !==
                    false,

                  custom_code:
                    passData.custom_code ||
                    passData.customCode ||
                    undefined

                })
            }
          );


        /*
         * Backend returns:
         *
         * {
         *   message: "...",
         *   pass: {...},
         *   user: {...}
         * }
         */

        const pass =
          res.pass ||
          res;


        return {

          ...pass,

          code:
            pass.code ||
            pass.tuition_code,

          tuition_code:
            pass.tuition_code ||
            pass.code
        };
      }

    } catch (err) {

      console.warn(
        "Live createTuitionPass failed:",
        err.message
      );


      /*
       * Do NOT fall back to mock mode
       * when the backend actually rejected
       * the request.
       */

      if (
        err.message !==
          "Failed to fetch" &&
        err.message !==
          "NetworkError when attempting to fetch resource"
      ) {

        throw err;
      }
    }


    // ==================================================
    // MOCK MODE
    // ==================================================

    const users =
      getStoredData(
        LS_KEYS.USERS,
        initialMockUsers
      );


    const studentId =
      passData.student_id ||
      passData.studentId;


    const studentEmail =
      passData.student_email ||
      passData.studentEmail;


    let student = null;


    if (studentId) {

      student =
        users.find(
          u =>
            String(u.id) ===
            String(studentId)
        );

    } else if (studentEmail) {

      student =
        users.find(
          u =>
            u.email?.toLowerCase() ===
            studentEmail
              .trim()
              .toLowerCase()
        );
    }


    if (!student) {

      throw new Error(
        "Student not found."
      );
    }


    if (
      student.role !==
      "student"
    ) {

      throw new Error(
        "Tuition Pass can only be issued to a student."
      );
    }


    if (
      student.status ===
        "active" &&
      student.tuition_code
    ) {

      throw new Error(
        "This student already has an active Tuition Pass."
      );
    }


    const existingPasses =
      getStoredData(
        LS_KEYS.TUITION_PASSES,
        initialMockTuitionPasses
      );


    // --------------------------------------------------
    // CUSTOM CODE OR AUTO CODE
    // --------------------------------------------------

    let code =
      passData.custom_code ||
      passData.customCode ||
      null;


    if (code) {

      code =
        code
          .trim()
          .toUpperCase();


      if (
        !code.startsWith(
          "TUITION-"
        )
      ) {

        code =
          "TUITION-" +
          code;
      }


      const duplicate =
        existingPasses.some(
          p =>
            (
              p.code ||
              p.tuition_code
            )?.toUpperCase() ===
            code
        );


      if (duplicate) {

        throw new Error(
          "This Tuition Pass code is already in use."
        );
      }

    } else {

      do {

        code =
          "TUITION-" +
          Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

      } while (
        existingPasses.some(
          p =>
            (
              p.code ||
              p.tuition_code
            )?.toUpperCase() ===
            code.toUpperCase()
        )
      );
    }


    // --------------------------------------------------
    // ACTIVATE STUDENT
    // --------------------------------------------------

    student.status =
      "active";

    student.tuition_code =
      code;

    student.active_device_id =
      null;

    student.last_active_at =
      null;


    // --------------------------------------------------
    // SAVE USER
    // --------------------------------------------------

    const updatedUsers =
      users.map(
        u =>
          u.id === student.id
            ? student
            : u
      );


    setStoredData(
      LS_KEYS.USERS,
      updatedUsers
    );


    // --------------------------------------------------
    // CREATE PASS
    // --------------------------------------------------

    const newPass = {

      id:
        Date.now(),

      organization_id:
        Number(
          passData.organization_id ||
          student.organization_id
        ) || 1,

      code,

      tuition_code:
        code,

      student_id:
        student.id,

      student_name:
        student.name,

      student_email:
        student.email,

      batch_name:
        passData.batch_name ||
        passData.batchName ||
        "Tuition Batch",

      is_single_use:
        passData.is_single_use !==
        false,

      is_redeemed:
        false,

      redeemed_by:
        null,

      redeemed_at:
        null,

      expires_at:
        passData.expires_at ||
        passData.expiresAt ||
        new Date(
          Date.now() +
          180 *
            24 *
            60 *
            60 *
            1000
        ).toISOString(),

      createdAt:
        new Date().toISOString(),

      status:
        "active"
    };


    setStoredData(
      LS_KEYS.TUITION_PASSES,
      [
        newPass,
        ...existingPasses
      ]
    );


    return {

      message:
        "Tuition Pass issued successfully.",

      pass:
        newPass,

      ...newPass,

      user:
        {
          ...student
        }
    };
  }


  // ======================================================
  // DELETE / REVOKE TUITION PASS
  // ======================================================

  async deleteTuitionPass(
    id
  ) {

    // ==================================================
    // LIVE BACKEND
    // ==================================================

    try {

      if (!this.forceMock) {

        /*
         * IMPORTANT:
         * Backend route is:
         *
         * /deleteTuitionPass/:id
         */

        const res =
          await this.request(
            `/tuition-passes/deleteTuitionPass/${id}`,
            {
              method: "DELETE"
            }
          );


        return (
          res.pass ||
          res
        );
      }

    } catch (err) {

      console.warn(
        "Live deleteTuitionPass failed:",
        err.message
      );


      if (
        err.message !==
          "Failed to fetch" &&
        err.message !==
          "NetworkError when attempting to fetch resource"
      ) {

        throw err;
      }
    }


    // ==================================================
    // MOCK MODE
    // ==================================================

    const users =
      getStoredData(
        LS_KEYS.USERS,
        initialMockUsers
      );


    const student =
      users.find(
        u =>
          String(u.id) ===
          String(id)
      );


    if (!student) {

      throw new Error(
        "Student not found."
      );
    }


    if (!student.tuition_code) {

      throw new Error(
        "This student does not have a Tuition Pass."
      );
    }


    // Revert student to pending

    student.tuition_code =
      null;

    student.status =
      "pending";

    student.active_device_id =
      null;

    student.last_active_at =
      null;


    const updatedUsers =
      users.map(
        u =>
          u.id === student.id
            ? student
            : u
      );


    setStoredData(
      LS_KEYS.USERS,
      updatedUsers
    );


    // Remove pass record

    const passes =
      getStoredData(
        LS_KEYS.TUITION_PASSES,
        initialMockTuitionPasses
      );


    const updatedPasses =
      passes.filter(
        p =>
          String(
            p.student_id
          ) !== String(id)
      );


    setStoredData(
      LS_KEYS.TUITION_PASSES,
      updatedPasses
    );


    return {

      message:
        "Tuition Pass revoked successfully."
    };
  }


  // ======================================================
  // REAL-TIME SESSION VERIFICATION
  // ======================================================

  async verifySession(
    userId,
    currentDeviceId
  ) {

    if (!userId) {

      return {
        valid: false,
        reason: "NO_USER"
      };
    }


    // When using the live backend, session validity is established at login.
    // Skipping mock localStorage lookup here prevents false USER_NOT_FOUND
    // terminations for users that exist only in the real database.
    if (!this.forceMock) {
      return { valid: true };
    }


    const users =
      getStoredData(
        LS_KEYS.USERS,
        initialMockUsers
      );


    const user =
      users.find(
        u =>
          u.id ===
            Number(userId) ||
          u.id ===
            userId
      );


    if (!user) {

      return {
        valid: false,
        reason:
          "USER_NOT_FOUND"
      };
    }


    // Pending student

    if (
      user.role ===
        "student" &&
      user.status ===
        "pending"
    ) {

      return {

        valid: false,

        reason:
          "PENDING",

        message:
          "Your account is awaiting approval. Your tutor must issue a Tuition Pass before you can login."
      };
    }


    // Suspended

    if (
      user.status ===
      "suspended"
    ) {

      return {

        valid: false,

        reason:
          "SUSPENDED",

        message:
          "Your tuition access was paused or suspended by your tutor."
      };
    }


    // Admins don't have single-device restriction

    if (
      user.role ===
        "admin" ||
      user.role ===
        "superadmin"
    ) {

      return {

        valid: true,

        user
      };
    }


    // Student device verification

    if (
      user.active_device_id &&
      currentDeviceId &&
      user.active_device_id !==
        currentDeviceId
    ) {

      return {

        valid: false,

        reason:
          "CONCURRENT_DEVICE_LOGIN",

        message:
          "Simultaneous login detected: Another device logged into this account. Sharing credentials is prohibited."
      };
    }


    return {

      valid: true,

      user
    };
  }


  // ======================================================
  // TOGGLE USER STATUS
  // ======================================================

  async toggleUserStatus(
    userId
  ) {

    const users =
      getStoredData(
        LS_KEYS.USERS,
        initialMockUsers
      );


    let newStatus =
      "active";


    const updated =
      users.map(
        u => {

          if (
            u.id ===
              Number(userId) ||
            u.id ===
              userId
          ) {

            newStatus =
              u.status ===
                "suspended"
                ? "active"
                : "suspended";


            return {

              ...u,

              status:
                newStatus
            };
          }


          return u;
        }
      );


    setStoredData(
      LS_KEYS.USERS,
      updated
    );


    return {

      message:
        `Student status is now ${newStatus}`,

      status:
        newStatus
    };
  }


  // ======================================================
  // RESET USER DEVICE
  // ======================================================

  async resetUserDevice(
    userId
  ) {

    const users =
      getStoredData(
        LS_KEYS.USERS,
        initialMockUsers
      );


    const updated =
      users.map(
        u => {

          if (
            u.id ===
              Number(userId) ||
            u.id ===
              userId
          ) {

            return {

              ...u,

              active_device_id:
                null
            };
          }


          return u;
        }
      );


    setStoredData(
      LS_KEYS.USERS,
      updated
    );


    return {

      message:
        "Device lock reset successfully"
    };
  }


  // ======================================================
  // QUIZZES API
  // ======================================================

  async getAllQuizzes(
    orgId
  ) {

    try {

      if (!this.forceMock) {

        const res =
          await this.request(
            "/quizzes/getAllQuizzes?includeQuestions=true"
          );


        const list =
          res.quizzes ||
          res;


        if (!orgId) {
          return list;
        }


        return list.filter(
          q =>
            q.organization_id ===
              Number(orgId) ||
            q.organization_id ===
              orgId
        );
      }

    } catch (err) {

      console.warn(
        "Using mock quizzes fallback:",
        err.message
      );
    }


    const currentQuizzes =
      getStoredData(
        LS_KEYS.QUIZZES,
        initialMockQuizzes
      );


    if (!orgId) {
      return currentQuizzes;
    }


    return currentQuizzes.filter(
      q =>
        q.organization_id ===
          Number(orgId) ||
        q.organization_id ===
          orgId
    );
  }


  async createQuiz(
    quizData
  ) {

    try {

      if (!this.forceMock) {

        const res =
          await this.request(
            "/quizzes/createQuiz",
            {
              method: "POST",

              body:
                JSON.stringify(
                  quizData
                )
            }
          );


        return (
          res.quiz ||
          res
        );
      }

    } catch (err) {

      console.warn(
        "Using mock createQuiz fallback:",
        err.message
      );
    }


    const currentQuizzes =
      getStoredData(
        LS_KEYS.QUIZZES,
        initialMockQuizzes
      );


    const newQuiz = {

      id:
        Date.now(),

      organization_id:
        Number(
          quizData.organization_id
        ) || 1,

      title:
        quizData.title,

      month:
        quizData.month ||
        "Unassigned",

      total_marks:
        Number(
          quizData.total_marks
        ) || 0,

      createdAt:
        new Date().toISOString(),

      questions:
        quizData.questions ||
        []
    };


    const updated = [
      newQuiz,
      ...currentQuizzes
    ];


    setStoredData(
      LS_KEYS.QUIZZES,
      updated
    );


    return newQuiz;
  }


  async updateQuiz(
    id,
    quizData
  ) {

    const currentQuizzes =
      getStoredData(
        LS_KEYS.QUIZZES,
        initialMockQuizzes
      );


    const updated =
      currentQuizzes.map(
        q =>
          q.id === Number(id) ||
          q.id === id
            ? {
                ...q,
                ...quizData
              }
            : q
      );


    setStoredData(
      LS_KEYS.QUIZZES,
      updated
    );


    return {
      message:
        "Quiz updated successfully"
    };
  }


  async deleteQuiz(
    id
  ) {

    const currentQuizzes =
      getStoredData(
        LS_KEYS.QUIZZES,
        initialMockQuizzes
      );


    const updated =
      currentQuizzes.filter(
        q =>
          q.id !== Number(id) &&
          q.id !== id
      );


    setStoredData(
      LS_KEYS.QUIZZES,
      updated
    );


    return {
      message:
        "Quiz deleted successfully"
    };
  }


  // ======================================================
  // QUESTIONS API
  // ======================================================

  async getQuestionsByQuizId(
    quizId
  ) {

    const currentQuizzes =
      getStoredData(
        LS_KEYS.QUIZZES,
        initialMockQuizzes
      );


    const quiz =
      currentQuizzes.find(
        q =>
          q.id ===
            Number(quizId) ||
          q.id ===
            quizId
      );


    return quiz
      ? quiz.questions ||
          []
      : [];
  }


  async createQuestion(
    questionData
  ) {

    const currentQuizzes =
      getStoredData(
        LS_KEYS.QUIZZES,
        initialMockQuizzes
      );


    const newQuestion = {

      id:
        Date.now(),

      quiz_id:
        Number(
          questionData.quiz_id
        ),

      question_text:
        questionData.question_text ||
        questionData.question,

      options:
        questionData.options,

      correct_answer:
        questionData.correct_answer ||
        questionData.answer,

      marks:
        Number(
          questionData.marks
        ) || 1,

      explanation:
        questionData.explanation ||
        ""
    };


    const updatedQuizzes =
      currentQuizzes.map(
        q => {

          if (
            q.id ===
              Number(
                questionData.quiz_id
              ) ||
            q.id ===
              questionData.quiz_id
          ) {

            const questions =
              q.questions ||
              [];


            return {

              ...q,

              questions: [
                ...questions,
                newQuestion
              ],

              total_marks:
                (
                  Number(
                    q.total_marks
                  ) || 0
                ) +
                newQuestion.marks
            };
          }


          return q;
        }
      );


    setStoredData(
      LS_KEYS.QUIZZES,
      updatedQuizzes
    );


    return newQuestion;
  }


  async updateQuestion(
    id,
    questionData
  ) {

    const currentQuizzes =
      getStoredData(
        LS_KEYS.QUIZZES,
        initialMockQuizzes
      );


    const updatedQuizzes =
      currentQuizzes.map(
        q => {

          if (q.questions) {

            const updatedQuestions =
              q.questions.map(
                question => {

                  if (
                    question.id ===
                      Number(id) ||
                    question.id ===
                      id
                  ) {

                    return {
                      ...question,
                      ...questionData
                    };
                  }


                  return question;
                }
              );


            return {

              ...q,

              questions:
                updatedQuestions
            };
          }


          return q;
        }
      );


    setStoredData(
      LS_KEYS.QUIZZES,
      updatedQuizzes
    );


    return {
      message:
        "Question updated successfully"
    };
  }


  async deleteQuestion(
    id
  ) {

    const currentQuizzes =
      getStoredData(
        LS_KEYS.QUIZZES,
        initialMockQuizzes
      );


    const updatedQuizzes =
      currentQuizzes.map(
        q => {

          if (q.questions) {

            return {

              ...q,

              questions:
                q.questions.filter(
                  question =>
                    question.id !==
                      Number(id) &&
                    question.id !==
                      id
                )
            };
          }


          return q;
        }
      );


    setStoredData(
      LS_KEYS.QUIZZES,
      updatedQuizzes
    );


    return {
      message:
        "Question deleted successfully"
    };
  }


  // ======================================================
  // NOTES API
  // ======================================================

  async getAllNotes(
    orgId,
    batchId
  ) {

    let currentNotes =
      getStoredData(
        LS_KEYS.NOTES,
        initialMockNotes
      );


    // Auto-migrate old notes
    if (
      currentNotes.length > 0 &&
      currentNotes[0].batch_id ===
        undefined
    ) {

      currentNotes =
        initialMockNotes;


      setStoredData(
        LS_KEYS.NOTES,
        currentNotes
      );
    }


    let filtered =
      currentNotes;


    if (orgId) {

      filtered =
        filtered.filter(
          n =>
            n.organization_id ===
              Number(orgId) ||
            n.organization_id ===
              orgId
        );
    }


    if (batchId) {

      filtered =
        filtered.filter(
          n =>
            !n.batch_id ||
            n.batch_id ===
              "all" ||
            Number(
              n.batch_id
            ) ===
              Number(batchId)
        );
    }


    return filtered;
  }


  async createNote(
    noteData
  ) {

    const currentNotes =
      getStoredData(
        LS_KEYS.NOTES,
        initialMockNotes
      );


    const newNote = {

      id:
        Date.now(),

      organization_id:
        Number(
          noteData.organization_id
        ) || 1,

      batch_id:
        noteData.batch_id
          ? Number(
              noteData.batch_id
            )
          : null,

      batch_name:
        noteData.batch_name ||
        "All Batches",

      title:
        noteData.title,

      topic:
        noteData.topic,

      class:
        noteData.class,

      semester:
        noteData.semester,

      content_type:
        noteData.content_type ||
        "text",

      content_url:
        noteData.content_url,

      createdAt:
        new Date().toISOString()
    };


    const updated = [
      newNote,
      ...currentNotes
    ];


    setStoredData(
      LS_KEYS.NOTES,
      updated
    );


    return newNote;
  }


  async updateNote(
    id,
    noteData
  ) {

    const currentNotes =
      getStoredData(
        LS_KEYS.NOTES,
        initialMockNotes
      );


    const updated =
      currentNotes.map(
        n =>
          n.id === Number(id) ||
          n.id === id
            ? {

                ...n,

                ...noteData,

                batch_id:
                  noteData.batch_id !==
                  undefined
                    ? (
                        noteData.batch_id
                          ? Number(
                              noteData.batch_id
                            )
                          : null
                      )
                    : n.batch_id,

                batch_name:
                  noteData.batch_name !==
                  undefined
                    ? noteData.batch_name
                    : n.batch_name
              }
            : n
      );


    setStoredData(
      LS_KEYS.NOTES,
      updated
    );


    return {
      message:
        "Note updated successfully"
    };
  }


  async deleteNote(
    id
  ) {

    const currentNotes =
      getStoredData(
        LS_KEYS.NOTES,
        initialMockNotes
      );


    const updated =
      currentNotes.filter(
        n =>
          n.id !== Number(id) &&
          n.id !== id
      );


    setStoredData(
      LS_KEYS.NOTES,
      updated
    );


    return {
      message:
        "Note deleted successfully"
    };
  }


  // ======================================================
  // AI MICROSERVICE API
  // ======================================================

  async checkAiHealth() {
    try {
      if (!this.forceMock) {
        return await this.request('/ai/health');
      }
    } catch (err) {
      console.warn('AI microservice live check failed, using fallback:', err.message);
    }
    return {
      status: 'UP',
      mode: 'Intelligent Fallback Engine',
      port: 5001
    };
  }

  async generateMCQs(payload) {
    try {
      if (!this.forceMock) {
        const res = await this.request('/ai/generate-mcqs', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        if (res && res.questions) return res;
      }
    } catch (err) {
      console.warn('AI live generateMCQs failed, using fallback:', err.message);
    }

    // Built-in intelligent educational fallback questions
    const topic = payload.topic || 'General Science';
    const count = payload.count || 4;
    const questions = [
      {
        question_text: `Which of the following is considered a core principle when mastering ${topic}?`,
        options: ['Modularity & Separation of Concerns', 'Arbitrary Hardcoding', 'Avoiding Testing', 'Unbounded Global State'],
        correct_answer: 'Modularity & Separation of Concerns',
        explanation: `Modularity and isolation of concerns are critical engineering foundations in ${topic}.`
      },
      {
        question_text: `In practical application of ${topic}, what is the recommended approach to state predictability?`,
        options: ['Immutable data transitions', 'Direct mutating of shared state', 'Silent failures without logging', 'Infinite event loops'],
        correct_answer: 'Immutable data transitions',
        explanation: 'Immutability ensures deterministic and trackable changes across the lifecycle.'
      },
      {
        question_text: `What primary benefit does automated verification provide when working with ${topic}?`,
        options: ['Prevents regressions & guarantees contract consistency', 'Slows down deployment pipelines', 'Forces redundant code execution', 'Eliminates need for documentation'],
        correct_answer: 'Prevents regressions & guarantees contract consistency',
        explanation: 'Automated verification enforces type safety and prevents unexpected regressions.'
      },
      {
        question_text: `When scaling applications built around ${topic}, which architecture pattern is preferred?`,
        options: ['Decoupled modular components', 'Monolithic tightly coupled script', 'Single point of failure', 'Bypassing error boundaries'],
        correct_answer: 'Decoupled modular components',
        explanation: 'Decoupled components allow independent scaling, testing, and maintainability.'
      }
    ].slice(0, count);

    return {
      success: true,
      questions,
      count: questions.length,
      mode: 'fallback'
    };
  }

  async generateNotes(payload) {
    try {
      if (!this.forceMock) {
        const res = await this.request('/ai/generate-notes', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        if (res && res.note) return res;
      }
    } catch (err) {
      console.warn('AI live generateNotes failed, using fallback:', err.message);
    }

    const topic = payload.topic || 'General Topic';
    const subject = payload.subject || 'Computer Science';
    return {
      success: true,
      note: {
        title: `${topic} - Master Revision Notes`,
        subject: subject,
        topic: topic,
        content_markdown: `# ${topic} Revision Guide\n\n## 1. Core Overview\nUnderstanding **${topic}** is critical in **${subject}**. This study note highlights foundational principles, best practices, and high-yield examination takeaways.\n\n## 2. Key Concepts\n- **Foundations**: System architecture and theoretical baseline.\n- **Operational Mechanics**: Step-by-step workflow and logic.\n- **Efficiency & Complexity**: Optimal performance patterns.\n\n## 3. High-Yield Summary\nAlways ensure predictable state transitions, handle edge cases cleanly, and verify outcomes with structured tests.`
      }
    };
  }

  async analyzeQuiz(payload) {
    try {
      if (!this.forceMock) {
        const res = await this.request('/ai/analyze-quiz', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        if (res && res.analysis) return res;
      }
    } catch (err) {
      console.warn('AI live analyzeQuiz failed, using fallback:', err.message);
    }

    const pct = Math.round(((payload.score || 0) / (payload.total_marks || 10)) * 100);
    return {
      success: true,
      analysis: {
        score: payload.score,
        total_marks: payload.total_marks,
        percentage: pct,
        summary: pct >= 80
          ? `Outstanding comprehension (${pct}%). The student demonstrated high mastery of core terminology and problem solving.`
          : pct >= 50
          ? `Solid foundation (${pct}%). The student demonstrates good conceptual familiarity, but needs reinforcement on nuanced edge cases.`
          : `Remedial review recommended (${pct}%). Key foundational topics should be revisited before taking subsequent advanced modules.`,
        recommendations: [
          'Review incorrect answers with the accompanying explanations.',
          'Solve 3 practice questions focusing on weak domains.',
          'Schedule an interactive review with your instructor.'
        ]
      }
    };
  }
}



// ======================================================
// EXPORT API INSTANCE
// ======================================================

export const api =
  new ApiService();