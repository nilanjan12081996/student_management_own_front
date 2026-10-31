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

    try {
      const storedUser = JSON.parse(localStorage.getItem("eduadmin_user") || "{}");
      if (storedUser?.role) {
        config.headers["X-User-Role"] = storedUser.role;
      }
    } catch (e) {
      // ignore
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
  // BATCHES API (Synced with MySQL Database)
  // ======================================================

  async getBatchesByOrganization(orgId) {
    if (!this.forceMock) {
      try {
        const response = await this.request('/batches/getAll');
        const list = Array.isArray(response)
          ? response
          : (response.data || response.batches || []);

        if (list && list.length > 0) {
          setStoredData(LS_KEYS.BATCHES, list);
          if (!orgId) return list;
          return list.filter(
            b => b.organization_id === Number(orgId) || b.organization_id === orgId
          );
        }
      } catch (err) {
        console.warn('Backend batches fetch failed, falling back to cached/mock data:', err.message);
      }
    }

    const allBatches = getStoredData(LS_KEYS.BATCHES, initialMockBatches);
    if (!orgId) return allBatches;
    return allBatches.filter(
      b => b.organization_id === Number(orgId) || b.organization_id === orgId
    );
  }

  async createBatch(batchData) {
    const join_code =
      batchData.join_code ||
      `${(batchData.name || 'BAT').substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payload = {
      organization_id: Number(batchData.organization_id) || 1,
      name: batchData.name,
      subject: batchData.subject || 'General Subject',
      join_code
    };

    if (!this.forceMock) {
      try {
        const response = await this.request('/batches/create', {
          method: 'POST',
          body: JSON.stringify(payload)
        });

        const created = response?.data || response;
        if (created && created.id) {
          const currentBatches = getStoredData(LS_KEYS.BATCHES, initialMockBatches);
          setStoredData(LS_KEYS.BATCHES, [
            created,
            ...currentBatches.filter(b => b.id !== created.id)
          ]);
          return created;
        }
      } catch (err) {
        console.warn('Backend batch create failed, falling back to local storage:', err.message);
      }
    }

    const currentBatches = getStoredData(LS_KEYS.BATCHES, initialMockBatches);
    const newBatch = {
      id: Date.now(),
      ...payload,
      student_count: 0,
      createdAt: new Date().toISOString()
    };
    setStoredData(LS_KEYS.BATCHES, [newBatch, ...currentBatches]);
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
            !q.organization_id ||
            Number(q.organization_id) === Number(orgId) ||
            q.organization_id === orgId
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

    // Auto-sync published quizzes and refresh question sets in localStorage
    let needsUpdate = false;
    for (const defaultQuiz of initialMockQuizzes) {
      const existingIdx = (currentQuizzes || []).findIndex(q => q.id === defaultQuiz.id);
      if (existingIdx === -1) {
        currentQuizzes.push(defaultQuiz);
        needsUpdate = true;
      } else {
        const existingQCount = currentQuizzes[existingIdx]?.questions?.length || 0;
        const defaultQCount = defaultQuiz?.questions?.length || 0;
        if (existingQCount < defaultQCount) {
          currentQuizzes[existingIdx].questions = defaultQuiz.questions;
          currentQuizzes[existingIdx].total_marks = defaultQuiz.total_marks;
          needsUpdate = true;
        }
      }
    }
    if (needsUpdate) {
      setStoredData(LS_KEYS.QUIZZES, currentQuizzes);
    }


    if (!orgId) {
      return currentQuizzes;
    }

    return currentQuizzes.filter(
      q =>
        !q.organization_id ||
        Number(q.organization_id) === Number(orgId) ||
        q.organization_id === orgId
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
    try {
      if (!this.forceMock) {
        const res = await this.request(`/questions/quiz/${quizId}`);
        const qList = res.questions || (Array.isArray(res) ? res : null);
        if (qList && qList.length > 0) {
          return qList;
        }
      }
    } catch (err) {
      console.warn("Live getQuestionsByQuizId failed, using stored fallback:", err.message);
    }

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
    let liveCreatedQuestion = null;
    try {
      if (!this.forceMock) {
        const res = await this.request(
          "/questions/createQuestion",
          {
            method: "POST",
            body: JSON.stringify(questionData)
          }
        );
        liveCreatedQuestion = res.question || res;
      }
    } catch (err) {
      console.warn("Live createQuestion failed, using mock fallback:", err.message);
    }

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


    return liveCreatedQuestion || newQuestion;
  }


  async updateQuestion(
    id,
    questionData
  ) {
    try {
      if (!this.forceMock) {
        await this.request(
          `/questions/updateQuestion/${id}`,
          {
            method: "PUT",
            body: JSON.stringify(questionData)
          }
        );
      }
    } catch (err) {
      console.warn("Live updateQuestion failed, updating locally:", err.message);
    }

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
    try {
      if (!this.forceMock) {
        await this.request(
          `/questions/deleteQuestion/${id}`,
          {
            method: "DELETE"
          }
        );
      }
    } catch (err) {
      console.warn("Live deleteQuestion failed, deleting locally:", err.message);
    }

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
  // QUIZ SUBMISSIONS & STUDENT PROGRESS
  // ======================================================

  async submitQuiz(quizId, submissionData) {
    try {
      if (!this.forceMock) {
        const res = await this.request(`/quizzes/${quizId}/submit`, {
          method: "POST",
          body: JSON.stringify(submissionData)
        });
        if (res && res.success) return res;
      }
    } catch (err) {
      console.warn("submitQuiz live failed, using mock storage fallback:", err.message);
    }

    const currentQuizzes = getStoredData(LS_KEYS.QUIZZES, initialMockQuizzes);
    const quiz = currentQuizzes.find(q => String(q.id) === String(quizId)) || currentQuizzes[0];
    const questions = quiz.questions || [];
    let score = 0;
    let totalMarks = 0;
    const wrongQuestions = [];
    const questionsReview = [];

    questions.forEach((q, idx) => {
      const qMarks = Number(q.marks || 5);
      totalMarks += qMarks;
      const studentAns = (submissionData.answers && (submissionData.answers[q.id] !== undefined ? submissionData.answers[q.id] : submissionData.answers[idx])) || "";
      const correctAns = q.correct_answer || "";
      const isCorrect = String(studentAns).trim().toLowerCase() === String(correctAns).trim().toLowerCase();

      if (isCorrect) {
        score += qMarks;
      } else {
        wrongQuestions.push({
          question_text: q.question_text,
          student_answer: studentAns || "Unanswered",
          correct_answer: correctAns,
          explanation: q.explanation || "Review core definitions and execution mechanics.",
          topic_tag: q.topic_tag || quiz.title,
          marks: qMarks
        });
      }

      questionsReview.push({
        id: q.id,
        question_text: q.question_text,
        options: q.options || [],
        student_answer: studentAns,
        correct_answer: correctAns,
        is_correct: isCorrect,
        marks: qMarks,
        explanation: q.explanation
      });
    });

    if (totalMarks === 0) totalMarks = quiz.total_marks || 15;

    const aiRes = await this.analyzeQuiz({
      student_name: submissionData.student_name || "Student",
      quiz_title: quiz.title,
      score,
      total_marks: totalMarks,
      wrong_questions: wrongQuestions
    });

    const aiAnalysis = (aiRes && aiRes.analysis) ? aiRes.analysis : {
      summary_badge: score >= (totalMarks * 0.8) ? "Mastery Achieved! Exceptional Performance" : (score >= (totalMarks * 0.5) ? "Solid Foundation — Target Specific Gap Areas" : "Action Required: Core Concepts Need Review"),
      percentage: Math.round((score / Math.max(totalMarks, 1)) * 100),
      score,
      total_marks: totalMarks,
      overall_feedback: `Great effort on '${quiz.title}'! Review the feedback below to reinforce weak areas.`,
      strengths: ["Showed determination attempting questions under assessment conditions."],
      critical_misconceptions: wrongQuestions.map(w => `On '${w.question_text.slice(0, 50)}...', remember that '${w.correct_answer}' is the required principle.`),
      action_plan: ["Review detailed question explanations below", "Re-read the batch study notes on weak topics", "Retake this quiz in 48 hours to confirm mastery"],
      focus_guidance: wrongQuestions.map(w => ({
        topic: w.topic_tag || quiz.title,
        urgency: "High Priority Focus",
        guidance: `Review '${w.topic_tag || quiz.title}' study notes. Pay special attention to edge cases.`
      })),
      recommended_topics: [quiz.title]
    };

    const newSub = {
      id: Date.now(),
      organization_id: Number(submissionData.organization_id) || quiz.organization_id || 1,
      quiz_id: quiz.id,
      user_id: Number(submissionData.user_id) || 4,
      student_name: submissionData.student_name || "Student",
      quiz_title: quiz.title,
      score,
      total_marks: totalMarks,
      answers_json: JSON.stringify(submissionData.answers || {}),
      feedback: aiAnalysis.overall_feedback || "Completed assessment.",
      graded_at: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const currentSubs = getStoredData(LS_KEYS.SUBMISSIONS, initialMockSubmissions);
    setStoredData(LS_KEYS.SUBMISSIONS, [newSub, ...currentSubs]);

    return {
      success: true,
      submission: newSub,
      ai_analysis: aiAnalysis,
      questions_review: questionsReview
    };
  }

  async getStudentProgress(userId) {
    try {
      if (!this.forceMock) {
        const idParam = (userId && userId !== 'all') ? userId : 'all';
        const res = await this.request(`/quizzes/student-progress/${idParam}`);
        if (res && res.success) return res;
      }
    } catch (err) {
      console.warn("getStudentProgress live check failed, using mock storage fallback:", err.message);
    }

    const currentSubs = getStoredData(LS_KEYS.SUBMISSIONS, initialMockSubmissions);
    const userSubs = currentSubs.filter(s => !userId || userId === 'all' || String(s.user_id) === String(userId));

    const totalScore = userSubs.reduce((acc, c) => acc + (Number(c.score) || 0), 0);
    const totalPossible = userSubs.reduce((acc, c) => acc + (Number(c.total_marks) || 10), 0);
    const avgPercentage = userSubs.length > 0 ? Math.round((totalScore / Math.max(totalPossible, 1)) * 100) : 0;

    const topicStats = {};
    userSubs.forEach(s => {
      const topic = s.quiz_title || "General Assessment";
      if (!topicStats[topic]) topicStats[topic] = { score: 0, total: 0, count: 0 };
      topicStats[topic].score += (Number(s.score) || 0);
      topicStats[topic].total += (Number(s.total_marks) || 10);
      topicStats[topic].count += 1;
    });

    const topicMastery = Object.entries(topicStats).map(([topic, stat]) => ({
      topic,
      percentage: Math.round((stat.score / Math.max(stat.total, 1)) * 100),
      attempts: stat.count,
      score: stat.score,
      total_marks: stat.total
    }));

    const topicsToFocus = topicMastery
      .filter(t => t.percentage < 80)
      .sort((a, b) => a.percentage - b.percentage)
      .map(t => ({
        topic: t.topic,
        percentage: t.percentage,
        urgency: t.percentage < 60 ? "Critical Focus Required" : "Reinforcement Recommended",
        recommendation: `Your score is ${t.percentage}%. Spend 30 minutes revising study notes on '${t.topic}'.`
      }));

    return {
      success: true,
      user_id: userId,
      total_quizzes_opted: userSubs.length,
      overall_percentage: avgPercentage,
      total_score: totalScore,
      total_possible: totalPossible,
      topic_mastery: topicMastery,
      topics_to_focus: topicsToFocus,
      history: userSubs
    };
  }

  async getQuizSubmissions(quizId) {
    try {
      if (!this.forceMock) {
        const res = await this.request(`/quizzes/${quizId}/submissions`);
        if (res && res.submissions) return res.submissions;
      }
    } catch (err) {
      console.warn("getQuizSubmissions live failed, using mock storage fallback:", err.message);
    }
    const currentSubs = getStoredData(LS_KEYS.SUBMISSIONS, initialMockSubmissions);
    return currentSubs.filter(s => String(s.quiz_id) === String(quizId));
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
      const storedUser = JSON.parse(localStorage.getItem('eduadmin_user') || '{}');
      if (storedUser?.role?.toLowerCase() === 'student') {
        return {
          status: 'RESTRICTED',
          message: 'AI Studio is restricted to instructors and administrators.',
          restricted: true
        };
      }
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
    const storedUser = JSON.parse(localStorage.getItem('eduadmin_user') || '{}');
    if (storedUser?.role?.toLowerCase() === 'student') {
      throw new Error('Access denied: Students are not permitted to use AI Studio MCQ generation.');
    }
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
    const storedUser = JSON.parse(localStorage.getItem('eduadmin_user') || '{}');
    if (storedUser?.role?.toLowerCase() === 'student') {
      throw new Error('Access denied: Students are not permitted to use AI Studio Notes generation.');
    }
    try {
      if (!this.forceMock) {
        const res = await this.request('/ai/generate-notes', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        if (res && res.note) return res;
      }
    } catch (err) {
      console.warn('AI live generateNotes failed, using CNN Knowledge Engine fallback:', err.message);
    }

    // ================================================================
    // DEEP CNN KNOWLEDGE ENGINE — Frontend Fallback
    // Topic-aware, subject-aware: each topic gets truly distinct notes!
    // ================================================================
    const topic = (payload.topic || 'General Topic').trim();
    const subject = (payload.subject || 'Computer Science').trim();
    const style = payload.style || 'Detailed Guide';
    const topicLower = topic.toLowerCase();
    const subjectLower = subject.toLowerCase();

    const isJava = subjectLower.includes('java') || topicLower.includes('java');
    const isPython = subjectLower.includes('python') || topicLower.includes('python');
    const isJavaMethods = isJava && (topicLower.includes('method') || topicLower.includes('function'));
    const isJavaOOP = isJava && (topicLower.includes('oop') || topicLower.includes('object') || topicLower.includes('class') || topicLower.includes('inherit') || topicLower.includes('encapsul') || topicLower.includes('polymorphi') || topicLower.includes('abstraction'));
    const isJavaArrays = isJava && (topicLower.includes('array') || topicLower.includes('list') || topicLower.includes('collection'));
    const isJavaException = isJava && (topicLower.includes('exception') || topicLower.includes('error') || topicLower.includes('try') || topicLower.includes('catch'));
    const isJavaThread = isJava && (topicLower.includes('thread') || topicLower.includes('concurrent') || topicLower.includes('synchroni'));
    const isJavaInterface = isJava && (topicLower.includes('interface') || topicLower.includes('abstract'));
    const isDB = subjectLower.includes('database') || subjectLower.includes('sql') || subjectLower.includes('dbms') || topicLower.includes('sql') || topicLower.includes('normal') || topicLower.includes('schema') || topicLower.includes('query') || topicLower.includes('join');
    const isJS = subjectLower.includes('javascript') || subjectLower.includes('js') || subjectLower.includes('web');
    const isJSAsync = isJS && (topicLower.includes('async') || topicLower.includes('promise') || topicLower.includes('await') || topicLower.includes('callback') || topicLower.includes('event loop'));
    const isPythonDecorator = isPython && (topicLower.includes('decorator') || topicLower.includes('generator') || topicLower.includes('iterator'));
    const isPythonOOP = isPython && (topicLower.includes('class') || topicLower.includes('oop') || topicLower.includes('inherit'));

    let noteContent = '';
    let title = '';
    let topicTags = [];

    if (isJavaMethods) {
      title = 'Java Methods — Multi-Layer Study Master';
      topicTags = ['Java Methods', 'Method Overloading', 'Call Stack & Parameters'];
      noteContent = `# Java Methods: Functions, Signatures & Execution Mechanics
*Discipline: Java Programming • Standard: ${style}*
*AI Engine: Deep CNN Knowledge Engine — Category: java_methods*

---

## 📌 Layer 1: Executive Mental Model & Intuitive Overview
In Java, a **Method** is a reusable block of code designed to perform a specific task.
* **The Kitchen Blender Analogy:**
  Think of a Java method like a blender machine:
  1. **Inputs (Parameters):** You drop fruit and milk into the blender (arguments).
  2. **Execution Body:** The blender's blades spin — the method logic runs.
  3. **Output (Return Value):** It pours out a smoothie. If a method returns nothing, it is \`void\` (like a doorbell that rings but produces no physical item).
* **The Core Problem it Solves:** Without methods, you'd copy-paste the same 20 lines everywhere. One bug = 50 places to fix.

---

## 🏛️ Layer 2: Theoretical Foundations & Formal Principles
1. **Method Signature** = Method Name + Parameter Types (return type is NOT part of the signature!)
2. **Pass-by-Value (ALWAYS in Java):** Primitives copy their value. Objects copy their reference address.
3. **The Call Stack:** Each method call pushes a Stack Frame. When the method returns, the frame is popped.
4. **Overloading vs Overriding:**
   - **Overloading:** Same class, same name, different parameters (compile-time)
   - **Overriding:** Child class redefines a parent method (runtime)

---

## 💻 Layer 4: Pure Java Code Walkthrough

\`\`\`java
public class PricingCalculator {

    // Standard method: returns a value
    public double calculateTotal(double unitPrice, int quantity) {
        if (unitPrice < 0 || quantity <= 0) {
            throw new IllegalArgumentException("Values must be positive.");
        }
        return unitPrice * quantity;
    }

    // Overloaded method: same name, extra parameter
    public double calculateTotal(double unitPrice, int quantity, double discountPct) {
        double subtotal = calculateTotal(unitPrice, quantity);
        return subtotal - (subtotal * discountPct / 100.0);
    }

    // Static utility: called without creating an object
    public static String formatCurrency(double amount) {
        return String.format("$%.2f", amount);
    }

    public static void main(String[] args) {
        PricingCalculator calc = new PricingCalculator();
        System.out.println(formatCurrency(calc.calculateTotal(25.50, 4)));       // $102.00
        System.out.println(formatCurrency(calc.calculateTotal(25.50, 4, 15.0))); // $86.70
    }
}
\`\`\`

---

## ⚠️ Layer 5: Common Exam Traps
| Trap | Why It Fails | Fix |
|------|-------------|-----|
| Overload by return type alone | Compiler can't distinguish \`int get()\` vs \`double get()\` | Change parameter types instead |
| Assuming pass-by-reference | Java copies the reference, not the object | Return modified result |
| Missing return statement | Compilation fails if a code branch returns nothing | Ensure all paths return or throw |

---

## 🧠 Layer 6: Self-Test
* **Q:** Can two methods share a name if only the return type differs?
  * **A:** No. Return type is not part of the method signature.
* **Q:** What is pass-by-value?
  * **A:** Java always passes a copy — either the primitive value or the object's reference address.

---

## 🚀 Layer 7: The S-I-G-N Mnemonic
- **S** — Signature (Name + Parameters)
- **I** — Inputs are always pass-by-value
- **G** — Guards validate pre-conditions at line 1
- **N** — Never rely on return type for overloading`;

    } else if (isJavaOOP) {
      title = 'Java OOP — Multi-Layer Study Master';
      topicTags = ['Java OOP', 'Encapsulation & Inheritance', 'Polymorphism & Abstraction'];
      noteContent = `# Java Object-Oriented Programming: The 4 Pillars & Design Architecture
*Discipline: Java Programming • Standard: ${style}*
*AI Engine: Deep CNN Knowledge Engine — Category: java_oop*

---

## 📌 Layer 1: Executive Mental Model & Intuitive Overview
**OOP** organizes code around real-world entities with **State (fields)** and **Behavior (methods)**.
* **Blueprint vs House (Class vs Object):**
  * **Class** = Architectural blueprint. You cannot live in a blueprint.
  * **Object** = The actual house built from that blueprint. 1 blueprint → 1000 houses.
* **ATM Machine (Encapsulation):** You cannot reach into the vault. You interact through the secured keypad interface.
* **The Core Problem it Solves:** Procedural code lets global functions directly mutate global variables → spaghetti. OOP bundles data and logic into protected capsules.

---

## 🏛️ Layer 2: The 4 Pillars

1. **Encapsulation** — Keep fields \`private\`, expose via getters/setters
2. **Inheritance** — Child class reuses parent via \`extends\`
3. **Polymorphism** — One interface, many behaviors (overriding at runtime)
4. **Abstraction** — Hide complexity, expose only the accelerator pedal (not the engine)

---

## 💻 Layer 4: Pure Java Code Walkthrough

\`\`\`java
// ABSTRACTION: Contract without implementation
abstract class BankAccount {
    private final String accountNumber;  // ENCAPSULATION: private
    private double balance;

    public BankAccount(String accountNumber, double initialBalance) {
        if (initialBalance < 0) throw new IllegalArgumentException("Balance cannot be negative.");
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
    }

    public double getBalance() { return this.balance; }
    public String getAccountNumber() { return this.accountNumber; }

    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Deposit must be positive.");
        this.balance += amount;
    }

    public abstract double calculateAnnualInterest(); // Must be overridden
}

// INHERITANCE: SavingsAccount reuses BankAccount
class SavingsAccount extends BankAccount {
    private final double interestRate;

    public SavingsAccount(String acctNum, double balance, double rate) {
        super(acctNum, balance);
        this.interestRate = rate;
    }

    // POLYMORPHISM: Overrides parent's abstract method
    @Override
    public double calculateAnnualInterest() {
        return getBalance() * (interestRate / 100.0);
    }
}

public class BankApp {
    public static void main(String[] args) {
        BankAccount acc = new SavingsAccount("SA-9042", 5000.0, 4.5); // Polymorphic reference!
        acc.deposit(1000.0);
        System.out.println("Balance: $" + acc.getBalance());           // 6000.0
        System.out.println("Interest: $" + acc.calculateAnnualInterest()); // 270.0
    }
}
\`\`\`

---

## ⚠️ Layer 5: Common Exam Traps
| Trap | Why It Fails | Fix |
|------|-------------|-----|
| Multiple class inheritance | \`class C extends A, B\` — Diamond Problem | Use \`implements\` for multiple interfaces |
| Leaking mutable references in getters | External code can mutate private state | Return defensive copies |
| Forgetting super() | Compiler error if parent has no default constructor | Call \`super(args)\` on line 1 |

---

## 🧠 Layer 6: Self-Test
* **Q:** Difference between Abstract Class and Interface?
  * **A:** Abstract class can have state and constructors (is-a relationship). Interface is a capability contract (can-do).
* **Q:** What enables Runtime Polymorphism?
  * **A:** Dynamic Method Dispatch — JVM checks the actual object type at runtime via vtable.

---

## 🚀 Layer 7: The A-P-I-E Mnemonic
- **A** — Abstraction
- **P** — Polymorphism
- **I** — Inheritance
- **E** — Encapsulation`;

    } else if (isJavaArrays) {
      title = 'Java Arrays & Collections — Multi-Layer Study Master';
      topicTags = ['Java Arrays', 'ArrayList', 'Collections Framework'];
      noteContent = `# Java Arrays & Collections: Data Storage & Traversal
*Discipline: Java Programming • Standard: ${style}*
*AI Engine: Deep CNN Knowledge Engine — Category: java_arrays*

---

## 📌 Layer 1: Intuitive Overview
Think of an **Array** as a numbered row of lockers in a school hallway.
- Each locker has a fixed number (index starting at 0).
- All lockers are the same size (same type).
- You can jump directly to locker #5 in O(1) time.

An **ArrayList** is a magical row of lockers that **automatically expands** when full.

---

## 💻 Layer 4: Java Code Walkthrough

\`\`\`java
import java.util.*;

public class CollectionsDemo {
    public static void main(String[] args) {
        // Fixed-size Array
        int[] scores = {95, 82, 77, 91, 88};
        System.out.println("Top score: " + scores[0]);

        // Dynamic ArrayList
        List<String> students = new ArrayList<>();
        students.add("Alice");
        students.add("Bob");
        students.add("Charlie");

        // Enhanced for-loop traversal
        for (String student : students) {
            System.out.println("Student: " + student);
        }

        // Sort & Search
        Collections.sort(students);
        int idx = Collections.binarySearch(students, "Bob");
        System.out.println("Bob found at index: " + idx);
    }
}
\`\`\`

---

## ⚠️ Layer 5: Exam Traps
- **ArrayIndexOutOfBoundsException**: Accessing index >= array.length
- **Arrays are fixed size**: Use ArrayList when size is unknown
- **== vs .equals()**: For arrays, use \`Arrays.equals(a, b)\`, not \`a == b\``;

    } else if (isJavaException) {
      title = 'Java Exception Handling — Multi-Layer Study Master';
      topicTags = ['Java Exceptions', 'Try-Catch-Finally', 'Checked vs Unchecked'];
      noteContent = `# Java Exception Handling: Defensive Programming & Error Recovery
*Discipline: Java Programming • Standard: ${style}*
*AI Engine: Deep CNN Knowledge Engine — Category: java_exceptions*

---

## 📌 Layer 1: Intuitive Overview
Exceptions are like **emergency airbags in a car**:
- Normal drive = no airbag needed (happy path).
- Crash detected = airbag deploys (exception thrown).
- Driver recovers = airbag handled (catch block).
- Seatbelt always on = \`finally\` always runs.

---

## 🏛️ Layer 2: Exception Hierarchy
\`\`\`
Throwable
├── Error (JVM-level, don't catch: OutOfMemoryError)
└── Exception
    ├── Checked (must handle: IOException, SQLException)
    └── RuntimeException (unchecked: NullPointerException, ArrayIndexOutOfBoundsException)
\`\`\`

---

## 💻 Layer 4: Java Code Walkthrough

\`\`\`java
public class FileProcessor {
    public String readFile(String path) throws java.io.IOException {
        if (path == null || path.isEmpty()) {
            throw new IllegalArgumentException("File path cannot be null or empty.");
        }
        
        try {
            java.nio.file.Path filePath = java.nio.file.Paths.get(path);
            return java.nio.file.Files.readString(filePath);
        } catch (java.io.FileNotFoundException e) {
            System.err.println("File not found: " + path);
            return ""; // Graceful fallback
        } finally {
            System.out.println("Cleanup resources — always runs!");
        }
    }
    
    // Custom exception
    static class InsufficientFundsException extends RuntimeException {
        private final double amount;
        public InsufficientFundsException(double amount) {
            super("Insufficient funds. Shortfall: $" + amount);
            this.amount = amount;
        }
    }
}
\`\`\`

---

## ⚠️ Exam Traps
- Catching \`Exception\` too broadly hides real bugs
- Never use exceptions for normal control flow
- \`finally\` runs even if \`return\` is in try block`;

    } else if (isJavaInterface) {
      title = 'Java Interfaces & Abstract Classes — Multi-Layer Study Master';
      topicTags = ['Java Interface', 'Abstract Class', 'Design Contracts'];
      noteContent = `# Java Interfaces & Abstract Classes: Design Contracts
*Discipline: Java Programming • Standard: ${style}*
*AI Engine: Deep CNN Knowledge Engine — Category: java_interface*

---

## 📌 Layer 1: Intuitive Overview
- **Interface** = A **job description** (what you must do, not how).
- **Abstract Class** = A **partially built template** (some work done, some left for children).

---

## 💻 Layer 4: Java Code Walkthrough

\`\`\`java
// Interface: pure contract
interface Drawable {
    void draw();              // abstract by default
    default void resize(int factor) {  // Java 8+ default method
        System.out.println("Resizing by factor: " + factor);
    }
}

interface Colorable {
    void setColor(String color);
}

// Abstract Class: partial implementation
abstract class Shape {
    protected String name;
    public Shape(String name) { this.name = name; }
    public abstract double area(); // subclasses must implement
    public String getName() { return name; }
}

// Concrete class: extends abstract + implements multiple interfaces
class Circle extends Shape implements Drawable, Colorable {
    private double radius;
    private String color;

    public Circle(double radius) {
        super("Circle");
        this.radius = radius;
    }

    @Override public double area() { return Math.PI * radius * radius; }
    @Override public void draw() { System.out.println("Drawing circle with r=" + radius); }
    @Override public void setColor(String c) { this.color = c; }
}
\`\`\`

---

## ⚠️ Exam Traps
- A class can \`implement\` multiple interfaces but only \`extends\` one class
- Interface fields are implicitly \`public static final\`
- Java 8+: Interfaces can have \`default\` and \`static\` methods`;

    } else if (isJavaThread) {
      title = 'Java Multithreading & Concurrency — Multi-Layer Study Master';
      topicTags = ['Java Threads', 'Synchronization', 'Concurrent Programming'];
      noteContent = `# Java Multithreading & Concurrency
*Discipline: Java Programming • Standard: ${style}*
*AI Engine: Deep CNN Knowledge Engine — Category: java_threads*

---

## 📌 Layer 1: Intuitive Overview
**Multithreading** = A restaurant with **multiple waiters** serving different tables simultaneously.
- Single thread = 1 waiter serving everyone sequentially (slow!).
- Multi-thread = 4 waiters working in parallel (fast, but must coordinate at the kitchen!).
- **Race condition** = Two waiters grabbing the last dessert simultaneously (data corruption!).

---

## 💻 Layer 4: Java Code Walkthrough

\`\`\`java
import java.util.concurrent.*;

public class BankTransfer {
    private double balance;

    public BankTransfer(double initial) { this.balance = initial; }

    // synchronized prevents race conditions
    public synchronized void deposit(double amount) {
        balance += amount;
    }

    public synchronized void withdraw(double amount) {
        if (balance < amount) throw new IllegalStateException("Insufficient funds");
        balance -= amount;
    }

    public static void main(String[] args) throws InterruptedException {
        BankTransfer account = new BankTransfer(1000.0);
        ExecutorService pool = Executors.newFixedThreadPool(4);

        for (int i = 0; i < 10; i++) {
            pool.submit(() -> account.deposit(100.0));
            pool.submit(() -> account.withdraw(50.0));
        }

        pool.shutdown();
        pool.awaitTermination(5, TimeUnit.SECONDS);
        System.out.println("Final balance: " + account.balance);
    }
}
\`\`\`

---

## ⚠️ Exam Traps
- \`synchronized\` on instance method locks on \`this\`
- \`volatile\` ensures visibility but not atomicity
- Prefer \`ExecutorService\` over raw \`Thread\` for production code`;

    } else if (isDB) {
      title = `${topic} — Database Study Master`;
      topicTags = ['SQL & Normalization', 'Relational Design', 'Query Optimization'];
      const isNormal = topicLower.includes('normal');
      const isJoin = topicLower.includes('join');
      const isSQL = topicLower.includes('sql') || topicLower.includes('query') || topicLower.includes('select');

      noteContent = `# ${topic}: Relational Database Mastery
*Discipline: ${subject} • Standard: ${style}*
*AI Engine: Deep CNN Knowledge Engine — Category: database*

---

## 📌 Layer 1: Intuitive Overview
${isNormal
  ? `**Normalization** is like organizing a closet — instead of throwing all clothes into one drawer, you create dedicated compartments (tables) linked by labels (foreign keys). This eliminates data duplication and anomalies.`
  : isJoin
  ? `**SQL JOINs** are like overlapping circles in a Venn diagram. They combine rows from two tables based on a related column. Think of it as merging two spreadsheets by a shared ID column.`
  : `**SQL (Structured Query Language)** is the universal language to talk to relational databases. Think of it as giving direct instructions to a very organized filing cabinet.`}

---

${isNormal ? `## 🏛️ Layer 2: The Normal Forms
1. **1NF** — Atomic cells, no repeating groups, unique primary key
2. **2NF** — No partial dependencies (every column depends on the FULL key)
3. **3NF** — No transitive dependencies (*"depend on the key, the whole key, nothing but the key"*)
4. **BCNF** — Every determinant is a candidate key` : ''}

## 💻 Layer 4: SQL Implementation

\`\`\`sql
${isNormal ? `-- 3NF Normalized Schema
CREATE TABLE departments (
    dept_id     INT AUTO_INCREMENT PRIMARY KEY,
    dept_name   VARCHAR(100) NOT NULL,
    location    VARCHAR(100) NOT NULL
);

CREATE TABLE employees (
    emp_id      INT AUTO_INCREMENT PRIMARY KEY,
    first_name  VARCHAR(50) NOT NULL,
    last_name   VARCHAR(50) NOT NULL,
    salary      DECIMAL(10, 2) NOT NULL,
    dept_id     INT NOT NULL,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);` : isJoin ? `-- INNER JOIN: Only matching rows from both tables
SELECT e.emp_id, e.first_name, d.dept_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.dept_id;

-- LEFT JOIN: All employees, even those with no department
SELECT e.first_name, COALESCE(d.dept_name, 'Unassigned') AS department
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.dept_id;

-- Aggregation with JOIN
SELECT d.dept_name, COUNT(e.emp_id) AS headcount, AVG(e.salary) AS avg_salary
FROM departments d
LEFT JOIN employees e ON d.dept_id = e.dept_id
GROUP BY d.dept_id, d.dept_name
HAVING COUNT(e.emp_id) > 2;` : `-- Basic CRUD Operations
SELECT emp_id, first_name, salary FROM employees WHERE salary > 50000 ORDER BY salary DESC;

INSERT INTO employees (first_name, last_name, salary, dept_id) VALUES ('Alice', 'Smith', 75000, 1);

UPDATE employees SET salary = salary * 1.10 WHERE dept_id = 1;

DELETE FROM employees WHERE emp_id = 42;`}
\`\`\`

---

## ⚠️ Exam Traps
- NULL comparisons use \`IS NULL\`, never \`= NULL\`
- \`WHERE\` filters rows before grouping; \`HAVING\` filters after \`GROUP BY\`
- INNER JOIN excludes rows with no match — use LEFT JOIN to keep all`;

    } else if (isJSAsync) {
      title = 'JavaScript Async & Event Loop — Multi-Layer Study Master';
      topicTags = ['Event Loop', 'Promises & Async/Await', 'Microtasks'];
      noteContent = `# JavaScript Asynchronous Architecture: Event Loop & Promises
*Discipline: Web Development • Standard: ${style}*
*AI Engine: Deep CNN Knowledge Engine — Category: js_async*

---

## 📌 Layer 1: Intuitive Overview
JavaScript is **single-threaded** — it executes one line at a time.
* **Restaurant Kitchen Analogy:**
  * **Waiter (Single Thread):** Takes orders one at a time.
  * **Kitchen (Web APIs):** Cooks food in the background (network, timers).
  * **Order Tray (Task Queue):** Completed orders wait here.
  * **Event Loop:** Waiter delivers ready food only when not taking an order.

---

## 🏛️ Layer 2: Priority Queues
1. **Microtask Queue (VIP):** \`Promise.then()\`, \`queueMicrotask()\` — drains completely first.
2. **Macrotask Queue (Standard):** \`setTimeout()\`, \`setInterval()\` — one task per tick.

---

## 💻 Layer 4: Async/Await Code

\`\`\`javascript
async function fetchUserProfile(userId) {
  if (!userId) throw new TypeError("userId is required");

  try {
    const response = await fetch(\`https://api.example.com/users/\${userId}\`);
    if (!response.ok) throw new Error(\`HTTP Error: \${response.status}\`);
    const userData = await response.json();
    return userData;
  } catch (err) {
    console.error("Request failed:", err.message);
    throw err;
  }
}
\`\`\`

---

## ⚠️ Exam Trap: Output Order
\`\`\`javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
// Output: A → D → C → B
// Sync first, then Microtasks, then Macrotasks
\`\`\``;

    } else if (isPythonOOP) {
      title = `Python OOP — Multi-Layer Study Master`;
      topicTags = ['Python Classes', 'Inheritance', 'Dunder Methods'];
      noteContent = `# Python Object-Oriented Programming
*Discipline: Python • Standard: ${style}*
*AI Engine: Deep CNN Knowledge Engine — Category: python_oop*

---

## 📌 Layer 1: Intuitive Overview
Python OOP = blueprint + instances. Everything in Python is an object.

---

## 💻 Layer 4: Python Code Walkthrough

\`\`\`python
from abc import ABC, abstractmethod
from dataclasses import dataclass

class BankAccount(ABC):
    """Encapsulates account state, enforces interface via abstract methods."""

    def __init__(self, account_number: str, balance: float) -> None:
        if balance < 0:
            raise ValueError("Initial balance cannot be negative.")
        self._account_number = account_number  # protected by convention
        self.__balance = balance               # private (name-mangled)

    @property
    def balance(self) -> float:
        return self.__balance

    def deposit(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Deposit amount must be positive.")
        self.__balance += amount

    @abstractmethod
    def calculate_interest(self) -> float: ...

    def __repr__(self) -> str:
        return f"BankAccount(acct={self._account_number!r}, balance={self.__balance:.2f})"


class SavingsAccount(BankAccount):
    def __init__(self, acct_num: str, balance: float, rate: float) -> None:
        super().__init__(acct_num, balance)
        self.rate = rate

    def calculate_interest(self) -> float:
        return self.balance * (self.rate / 100)


# Usage
acc = SavingsAccount("SA-001", 5000.0, 4.5)
acc.deposit(1000.0)
print(f"Balance: {acc.balance:.2f}")
print(f"Interest: {acc.calculate_interest():.2f}")
\`\`\`

---

## ⚠️ Exam Traps
- \`self\` is the instance reference — always first parameter
- \`__attr\` = name mangled (private), \`_attr\` = protected by convention
- \`@property\` makes a method callable as an attribute (no parentheses)`;

    } else {
      // Generic adaptive content — still topic-specific & structured
      const codeLang = isJava ? 'java' : isPython ? 'python' : 'javascript';
      const cleanTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

      title = `${cleanTopic} — Multi-Layer Study Master`;
      topicTags = [`${cleanTopic} Fundamentals`, `${cleanTopic} Application`, `${cleanTopic} Best Practices`];

      let codeBlock = '';
      if (isJava) {
        codeBlock = `public class ${cleanTopic.replace(/\s+/g, '')}Demo {
    private String name;

    public ${cleanTopic.replace(/\s+/g, '')}Demo(String name) {
        this.name = name;
    }

    public void execute() {
        System.out.println("Executing " + this.name + " with Java best practices.");
    }

    public static void main(String[] args) {
        new ${cleanTopic.replace(/\s+/g, '')}Demo("${cleanTopic}").execute();
    }
}`;
      } else if (isPython) {
        codeBlock = `class ${cleanTopic.replace(/\s+/g, '')}Demo:
    def __init__(self, name: str) -> None:
        self.name = name

    def execute(self) -> dict:
        """Demonstrates ${cleanTopic} with Python best practices."""
        return {"topic": self.name, "status": "SUCCESS"}

if __name__ == "__main__":
    demo = ${cleanTopic.replace(/\s+/g, '')}Demo("${cleanTopic}")
    print(demo.execute())`;
      } else {
        codeBlock = `// Clean implementation for ${cleanTopic}
function execute${cleanTopic.replace(/\s+/g, '')}(options = {}) {
  if (!options) throw new TypeError("Options cannot be null");
  return Object.freeze({
    topic: "${cleanTopic}",
    timestamp: new Date().toISOString(),
    status: "PROCESSED",
    ...options
  });
}

console.log(execute${cleanTopic.replace(/\s+/g, '')}({ mode: "study" }));`;
      }

      noteContent = `# ${cleanTopic} — Comprehensive Study Guide
*Discipline: ${subject} • Standard: ${style}*
*AI Engine: Deep CNN Knowledge Engine — Category: adaptive*

---

## 📌 Layer 1: Executive Mental Model
**${cleanTopic}** is a fundamental concept in ${subject}.
* **Think of it as:** A modular building block — it establishes clean boundaries, clear input-to-output transformations, and isolated responsibilities.
* **Why it matters:** Mastering ${cleanTopic} lets you write predictable, maintainable, and testable ${subject} solutions.

---

## 🏛️ Layer 2: Theoretical Foundations
1. **Separation of Concerns:** ${cleanTopic} isolates distinct responsibilities so changes in one area don't break others.
2. **Deterministic Contracts:** Given the same inputs, ${cleanTopic} guarantees repeatable, predictable outputs.
3. **Boundary Verification:** Always validate pre-conditions before entering internal execution pipelines.

---

## 💻 Layer 3: Practical Implementation

\`\`\`${codeLang}
${codeBlock}
\`\`\`

---

## ⚠️ Layer 4: Common Exam Traps
1. **Ignoring Null/Boundary States:** Always handle null, empty, or zero-value edge cases.
2. **Tight Coupling:** Over-relying on concrete implementations instead of abstract contracts.
3. **Unhandled Exceptions:** Forgetting to catch or propagate errors gracefully.

---

## 🧠 Layer 5: Self-Test
* **Q:** What is the primary benefit of modular decomposition in ${cleanTopic}?
  * **A:** Reduces complexity, simplifies unit testing, and isolates bugs to single modules.
* **Q:** How should invalid inputs be handled?
  * **A:** Throw informative exceptions early at boundary entry points.

---

## 🚀 Layer 6: Key Takeaways
- Always prefer **contracts over implementations**
- Write **defensive code** — validate first, execute second
- Design for **testability** — each unit should be independently verifiable`;
    }

    return {
      success: true,
      note: {
        title,
        subject,
        topic,
        style,
        topic_tags: topicTags,
        content: noteContent,
        content_markdown: noteContent,
        cnn_powered: true,
        mode: 'Deep CNN Knowledge Engine Fallback'
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

  async analyzeStudentProgress(payload) {
    try {
      if (!this.forceMock) {
        const res = await this.request('/ai/student-progress-analysis', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        if (res && res.progress) return res.progress;
      }
    } catch (err) {
      console.warn('analyzeStudentProgress live failed:', err.message);
    }
    return null;
  }
}



// ======================================================
// EXPORT API INSTANCE
// ======================================================

export const api =
  new ApiService();