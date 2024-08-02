const navigation = () => {
  return [
    {
      title: 'Trang chủ',
      icon: 'tabler:smart-home',
      path: '/dashboards/analytics'
    },
    {
      path: '/',
      title: 'Kiểm soát vào ra',
      icon: 'tabler:lock-access',
      children: [
        {
          title: 'Sự kiện',
          path: '/access-control/event-management',
          icon: 'tabler:calendar-event'
        },
        {
          title: 'Thiết bị',
          path: '/device-management',
          icon: 'tabler:accessible'
        },
        {
          path: '/pages/access-rights/list',
          title: 'Quyền truy cập',
          icon: 'tabler:calendar-month'
        },

        {
          path: '/pages/door-access/list',
          title: 'Quyền truy cập cửa',
          icon: 'tabler:door-enter'
        },
        {
          path: '/pages/schedule-access/list',
          title: 'Quản lý lịch',
          icon: 'tabler:calendar-due'
        },

        {
          path: '/pages/door-management/list',
          title: 'Quản lý cửa',
          icon: 'tabler:door'
        },
        {
          path: '/pages/group-access/list',
          title: 'Nhóm quyền truy cập',
          icon: 'tabler:mood-check'
        },

        {
          title: 'Chấm công',
          path: '/access-control/time-keeping',
          icon: 'tabler:lock-access'
        },
        {
          path: '/pages/report-month/list',
          title: 'Báo cáo tháng',
          icon: 'tabler:id'
        }

        // {
        //   path: '/pages/access-rights/list',
        //   title: 'Quyền truy cập',
        //   icon: 'tabler:shield'
        // },
        // {
        //   path: '/pages/access-rights/list',
        //   title: 'Thống kê',
        //   icon: 'tabler:statistics/time?tab=%2Fstatistics%2Ftime'
        // },
        // {
        //   path: '/pages/access-rights/list',
        //   title: 'Hẹn lịch',
        //   icon: 'tabler:guest-registrations'
        // }
      ]
    },
    {
      path: '/',
      title: 'Quản lý hiệu suất',
      icon: 'tabler:lock-access',
      children: [
        {
          title: 'Thiết lập bộ KPI',
          path: '/kpi',
          icon: 'tabler:calendar-event'
        },
        {
          title: 'Giao KPI',
          path: '/kpi/assign-kpi',
          icon: 'tabler:calendar-event'
        },
        {
          title: 'Đánh giá KPI',
          path: '/kpi/assess-kpi',
          icon: 'tabler:calendar-event'
        },
        {
          path: '/mappingACToInf',
          title: 'Cài đặt nâng cao',
          icon: 'tabler:shield'
        }

        // {
        //   path: '/pages/access-rights/list',
        //   title: 'Thống kê',
        //   icon: 'tabler:statistics/time?tab=%2Fstatistics%2Ftime'
        // },
        // {
        //   path: '/pages/access-rights/list',
        //   title: 'Hẹn lịch',
        //   icon: 'tabler:guest-registrations'
        // }
      ]
    },
    {
      path: '/asset',
      title: 'Hệ thống VMS',
      icon: 'tabler:camera',
      children: [
        {
          title: 'Xem trực tiếp',
          path: '/vms/live-view',
          icon: 'tabler:video'
        },

        // {
        //   title: 'Xem trực tiếp 2',
        //   path: '/vms/live-view-p2p-private'
        // },
        {
          title: 'Xem lại',
          path: '/vms/playback-camera',
          icon: 'tabler:video-minus'
        },
        {
          title: 'Trích xuất clip',
          path: '/vms/clip-extraction',
          icon: 'tabler:file-export'
        },
        {
          title: 'Sự kiện AI',
          path: '/vms/events/view/eventList',
          icon: 'tabler:timeline-event-exclamation'
        },
        {
          title: 'Khuôn mặt',
          path: '/vms/events/view/eventFace',
          icon: 'tabler:timeline-event-exclamation'
        },
        {
          title: 'Biển số',
          path: '/vms/events/view/eventCar',
          icon: 'tabler:timeline-event-exclamation'
        },

        // {
        //   title: 'Phát hiện đám đông',
        //   path: '/vms/events',
        //   icon: 'tabler:timeline-event-exclamation'
        // },

        {
          title: 'Bản đồ AI',
          path: '/vms/events/view/eventMap',
          icon: 'tabler:timeline-event-exclamation'
        },
        {
          title: 'Tổng quan AI',
          path: '/vms/ai-config/view/eventOverview',
          icon: 'tabler:settings'
        },
        {
          title: 'Danh sách cấu hình AI',
          path: '/vms/ai-config/view/aiConfig',
          icon: 'tabler:settings'
        },
        {
          title: 'Khoang vùng AI',
          path: '/vms/ai-config/view/eventConfig',
          icon: 'tabler:settings'
        },
        {
          title: 'Model AI',
          path: '/vms/ai-config/view/modelAIList',
          icon: 'tabler:settings'
        },
        {
          title: 'Sự cố hệ thống',
          path: '/vms/error-system',
          icon: 'tabler:id-badge-off'
        },
        {
          title: 'Nhóm camera',
          path: '/vms/camera-group',
          icon: 'tabler:schema'
        },
        {
          title: 'Danh sách camera',
          path: '/vms/camera-config/table',
          icon: 'tabler:device-cctv'
        },
        {
          title: 'Thêm camera',
          path: '/vms/camera-config/add',
          icon: 'tabler:device-cctv'
        },
        {
          title: 'Danh sách NVR',
          path: '/vms/nvr-config/table',
          icon: 'tabler:server-2'
        },
        {
          title: 'Thêm NVR',
          path: '/vms/nvr-config/add',
          icon: 'tabler:server-2'
        },
        {
          title: 'Smart NVR',
          path: '/vms/smart-nvr/table',
          icon: 'tabler:accessible'
        },
        {
          path: '/pages/face_management/list',
          title: 'Quản lý khuôn mặt',
          icon: 'tabler:face-id'
        },
        {
          path: '/pages/car_management/list',
          title: 'Quản lý Biển số',
          icon: 'tabler:id-badge-2'
        }

        // {
        //   title: 'Thư viện media',
        //   path: '/vms/library'
        // },
        // {
        //   title: 'Bản đồ số',
        //   path: '/vms/map'
        // }
      ]
    },

    //   ]
    // },
    // {
    //   path: '/pages/report-month/list',
    //   title: 'Báo cáo tháng',
    //   icon: 'tabler:id'
    // },

    // {
    //   title: 'Dashboards',
    //   icon: 'tabler:smart-home',
    //   badgeContent: 'new',
    //   badgeColor: 'error',
    //   children: [
    //     {
    //       title: 'Analytics',
    //       path: '/dashboards/analytics'
    //     },
    //     {
    //       title: 'CRM',
    //       path: '/dashboards/crm'
    //     },
    //     {
    //       title: 'eCommerce',
    //       path: '/dashboards/ecommerce'
    //     }
    //   ]
    // },
    // {
    //   sectionTitle: 'Apps & Pages'
    // },
    // {
    //   title: 'Email',
    //   icon: 'tabler:mail',
    //   path: '/apps/email'
    // },
    // {
    //   title: 'Chat',
    //   icon: 'tabler:messages',
    //   path: '/apps/chat'
    // },
    // {
    //   title: 'Calendar',
    //   icon: 'tabler:calendar',
    //   path: '/apps/calendar'
    // },
    // {
    //   title: 'Invoice',
    //   icon: 'tabler:file-dollar',
    //   children: [
    //     {
    //       title: 'List',
    //       path: '/apps/invoice/list'
    //     },
    //     {
    //       title: 'Preview',
    //       path: '/apps/invoice/preview'
    //     },
    //     {
    //       title: 'Edit',
    //       path: '/apps/invoice/edit'
    //     },
    //     {
    //       title: 'Add',
    //       path: '/apps/invoice/add'
    //     }
    //   ]
    // },
    {
      title: 'User',
      icon: 'tabler:user',
      children: [
        {
          title: 'Người dùng',
          icon: 'tabler:user',
          path: '/apps/user/list'
        },

        {
          title: 'Hồ sơ ứng tuyển',
          icon: 'tabler:building',
          path: '/cv'
        },
        {
          title: 'Cơ cấu tổ chức',
          icon: 'tabler:building',
          path: '/organizational-structure'
        },
        {
          title: 'Cơ cấu tổ chức',
          icon: 'tabler:building',
          path: '/organization/list'
        },
        {
          title: 'Vai Trò',
          icon: 'tabler:users',
          path: '/apps/roles'
        },
        {
          title: 'Bảng lương',
          icon: 'tabler:coin-pound',
          path: '/salary'
        },
        {
          title: 'Quy định về lương',
          icon: 'tabler:moneybag',
          path: '/salaryRule'
        },
        {
          title: 'Bản đồ số',
          icon: 'tabler:map',
          path: '/pages/digital-map'
        },
        {
          title: 'Quản lý danh sách đen',
          icon: 'tabler:user-off',
          path: '/pages/blacklist-management'
        }
      ]
    },
    {
      path: '/',
      title: 'Smart Parking',
      icon: 'tabler:lock-access',
      children: [
        {
          path: '/smart-parking/caller',
          title: 'Thuê bao',
          icon: 'tabler:phone'
        },
        {
          path: '/smart-parking/caller-type',
          title: 'Loại thuê bao',
          icon: 'tabler:phone'
        },
        {
          path: '/smart-parking/cards',
          title: 'Thẻ',
          icon: 'tabler:cards'
        },
        {
          path: '/smart-parking/vehicle',
          title: 'Phương tiện',
          icon: 'tabler:car'
        },
        {
          path: '/smart-parking/vehicle-type',
          title: 'Loại phương tiện',
          icon: 'tabler:parking'
        },
        {
          path: '/smart-parking/service',
          title: 'Dịch vụ',
          icon: 'tabler:zoom-money'
        },
        {
          path: '/smart-parking/parking',
          title: 'Bãi đỗ xe',
          icon: 'tabler:parking'
        },

        {
          path: '/smart-parking/asset',
          title: 'Tài sản',
          icon: 'tabler:moneybag',
          children: [
            {
              title: 'Loại tài sản',
              path: '/smart-parking/assetType'
            },
            {
              title: 'Tài sản',
              path: '/smart-parking/asset'
            }
          ]
        }

        // {
        //   path: '/pages/access-rights/list',
        //   title: 'Quyền truy cập',
        //   icon: 'tabler:shield'
        // },
        // {
        //   path: '/pages/access-rights/list',
        //   title: 'Thống kê',
        //   icon: 'tabler:statistics/time?tab=%2Fstatistics%2Ftime'
        // },
        // {
        //   path: '/pages/access-rights/list',
        //   title: 'Hẹn lịch',
        //   icon: 'tabler:guest-registrations'
        // }
      ]
    }

    // {
    //   path: '/caller',
    //   title: 'Thuê bao',
    //   icon: 'tabler:phone'
    // },
    // {
    //   path: '/cards',
    //   title: 'Thẻ',
    //   icon: 'tabler:cards'
    // },
    // {
    //   path: '/vehicle',
    //   title: 'Phương tiện',
    //   icon: 'tabler:car'
    // },
    // {
    //   path: '/service',
    //   title: 'Dịch vụ',
    //   icon: 'tabler:zoom-money'
    // },
    // {
    //   path: '/parking',
    //   title: 'Bãi đỗ xe',
    //   icon: 'tabler:parking'
    // },
    // {
    //   path: '/asset',
    //   title: 'Tài sản',
    //   icon: 'tabler:moneybag',
    //   children: [
    //     {
    //       title: 'Loại tài sản',
    //       path: '/assetType'
    //     },
    //     {
    //       title: 'Tài sản',
    //       path: '/asset'
    //     }
    //   ]
    // },

    // {
    //   title: 'Dashboards',
    //   icon: 'tabler:smart-home',
    //   badgeContent: 'new',
    //   badgeColor: 'error',
    //   children: [
    //     {
    //       title: 'Analytics',
    //       path: '/dashboards/analytics'
    //     },
    //     {
    //       title: 'CRM',
    //       path: '/dashboards/crm'
    //     },
    //     {
    //       title: 'eCommerce',
    //       path: '/dashboards/ecommerce'
    //     }
    //   ]
    // },
    // {
    //   sectionTitle: 'Apps & Pages'
    // },
    // {
    //   title: 'Email',
    //   icon: 'tabler:mail',
    //   path: '/apps/email'
    // },
    // {
    //   title: 'Chat',
    //   icon: 'tabler:messages',
    //   path: '/apps/chat'
    // },
    // {
    //   title: 'Calendar',
    //   icon: 'tabler:calendar',
    //   path: '/apps/calendar'
    // },
    // {
    //   title: 'Invoice',
    //   icon: 'tabler:file-dollar',
    //   children: [
    //     {
    //       title: 'List',
    //       path: '/apps/invoice/list'
    //     },
    //     {
    //       title: 'Preview',
    //       path: '/apps/invoice/preview'
    //     },
    //     {
    //       title: 'Edit',
    //       path: '/apps/invoice/edit'
    //     },
    //     {
    //       title: 'Add',
    //       path: '/apps/invoice/add'
    //     }
    //   ]
    // },
    // {
    //   title: 'User',
    //   icon: 'tabler:user',
    //   children: [
    //     {
    //       title: 'List',
    //       path: '/apps/user/list'
    //     },
    //     {
    //       title: 'View',
    //       children: [
    //         {
    //           title: 'Account',
    //           path: '/apps/user/view/account'
    //         },
    //         {
    //           title: 'Security',
    //           path: '/apps/user/view/security'
    //         },
    //         {
    //           title: 'Billing & Plans',
    //           path: '/apps/user/view/billing-plan'
    //         },
    //         {
    //           title: 'Notifications',
    //           path: '/apps/user/view/notification'
    //         },
    //         {
    //           title: 'Connection',
    //           path: '/apps/user/view/connection'
    //         }
    //       ]
    //     }
    //   ]
    // },
    // {
    //   title: 'Roles & Permissions',
    //   icon: 'tabler:settings',
    //   children: [
    //     {
    //       title: 'Roles',
    //       path: '/apps/roles'
    //     },
    //     {
    //       title: 'Permissions',
    //       path: '/apps/permissions'
    //     }
    //   ]
    // },
    // {
    //   title: 'Pages',
    //   icon: 'tabler:file',
    //   children: [
    //     {
    //       title: 'User Profile',
    //       children: [
    //         {
    //           title: 'Profile',
    //           path: '/pages/user-profile/profile'
    //         },
    //         {
    //           title: 'Teams',
    //           path: '/pages/user-profile/teams'
    //         },
    //         {
    //           title: 'Projects',
    //           path: '/pages/user-profile/projects'
    //         },
    //         {
    //           title: 'Connections',
    //           path: '/pages/user-profile/connections'
    //         }
    //       ]
    //     },
    //     {
    //       title: 'Account Settings',
    //       children: [
    //         {
    //           title: 'Account',
    //           path: '/pages/account-settings/account'
    //         },
    //         {
    //           title: 'Security',
    //           path: '/pages/account-settings/security'
    //         },
    //         {
    //           title: 'Billing',
    //           path: '/pages/account-settings/billing'
    //         },
    //         {
    //           title: 'Notifications',
    //           path: '/pages/account-settings/notifications'
    //         },
    //         {
    //           title: 'Connections',
    //           path: '/pages/account-settings/connections'
    //         }
    //       ]
    //     },
    //     {
    //       title: 'FAQ',
    //       path: '/pages/faq'
    //     },
    //     {
    //       title: 'Help Center',
    //       path: '/pages/help-center'
    //     },
    //     {
    //       title: 'Pricing',
    //       path: '/pages/pricing'
    //     },
    //     {
    //       title: 'Miscellaneous',
    //       children: [
    //         {
    //           openInNewTab: true,
    //           title: 'Coming Soon',
    //           path: '/pages/misc/coming-soon'
    //         },
    //         {
    //           openInNewTab: true,
    //           title: 'Under Maintenance',
    //           path: '/pages/misc/under-maintenance'
    //         },
    //         {
    //           openInNewTab: true,
    //           title: 'Page Not Found - 404',
    //           path: '/pages/misc/404-not-found'
    //         },
    //         {
    //           openInNewTab: true,
    //           title: 'Not Authorized - 401',
    //           path: '/pages/misc/401-not-authorized'
    //         },
    //         {
    //           openInNewTab: true,
    //           title: 'Server Error - 500',
    //           path: '/pages/misc/500-server-error'
    //         }
    //       ]
    //     }
    //   ]
    // },
    // {
    //   title: 'Auth Pages',
    //   icon: 'tabler:lock',
    //   children: [
    //     {
    //       title: 'Login',
    //       children: [
    //         {
    //           openInNewTab: true,
    //           title: 'Login v1',
    //           path: '/pages/auth/login-v1'
    //         },
    //         {
    //           openInNewTab: true,
    //           title: 'Login v2',
    //           path: '/pages/auth/login-v2'
    //         },
    //         {
    //           openInNewTab: true,
    //           title: 'Login With AppBar',
    //           path: '/pages/auth/login-with-appbar'
    //         }
    //       ]
    //     },
    //     {
    //       title: 'Register',
    //       children: [
    //         {
    //           openInNewTab: true,
    //           title: 'Register v1',
    //           path: '/pages/auth/register-v1'
    //         },
    //         {
    //           openInNewTab: true,
    //           title: 'Register v2',
    //           path: '/pages/auth/register-v2'
    //         },
    //         {
    //           openInNewTab: true,
    //           title: 'Register Multi-Steps',
    //           path: '/pages/auth/register-multi-steps'
    //         }
    //       ]
    //     },
    //     {
    //       title: 'Verify Email',
    //       children: [
    //         {
    //           openInNewTab: true,
    //           title: 'Verify Email v1',
    //           path: '/pages/auth/verify-email-v1'
    //         },
    //         {
    //           openInNewTab: true,
    //           title: 'Verify Email v2',
    //           path: '/pages/auth/verify-email-v2'
    //         }
    //       ]
    //     },
    //     {
    //       title: 'Forgot Password',
    //       children: [
    //         {
    //           openInNewTab: true,
    //           title: 'Forgot Password v1',
    //           path: '/pages/auth/forgot-password-v1'
    //         },
    //         {
    //           openInNewTab: true,
    //           title: 'Forgot Password v2',
    //           path: '/pages/auth/forgot-password-v2'
    //         }
    //       ]
    //     },
    //     {
    //       title: 'Reset Password',
    //       children: [
    //         {
    //           openInNewTab: true,
    //           title: 'Reset Password v1',
    //           path: '/pages/auth/reset-password-v1'
    //         },
    //         {
    //           openInNewTab: true,
    //           title: 'Reset Password v2',
    //           path: '/pages/auth/reset-password-v2'
    //         }
    //       ]
    //     },
    //     {
    //       title: 'Two Steps',
    //       children: [
    //         {
    //           openInNewTab: true,
    //           title: 'Two Steps v1',
    //           path: '/pages/auth/two-steps-v1'
    //         },
    //         {
    //           openInNewTab: true,
    //           title: 'Two Steps v2',
    //           path: '/pages/auth/two-steps-v2'
    //         }
    //       ]
    //     }
    //   ]
    // },
    // {
    //   title: 'Wizard Examples',
    //   icon: 'tabler:forms',
    //   children: [
    //     {
    //       title: 'Checkout',
    //       path: '/pages/wizard-examples/checkout'
    //     },
    //     {
    //       title: 'Property Listing',
    //       path: '/pages/wizard-examples/property-listing'
    //     },
    //     {
    //       title: 'Create Deal',
    //       path: '/pages/wizard-examples/create-deal'
    //     }
    //   ]
    // },
    // {
    //   icon: 'tabler:square',
    //   title: 'Dialog Examples',
    //   path: '/pages/dialog-examples'
    // },
    // {
    //   sectionTitle: 'User Interface'
    // },
    // {
    //   title: 'Typography',
    //   icon: 'tabler:typography',
    //   path: '/ui/typography'
    // },
    // {
    //   title: 'Icons',
    //   path: '/ui/icons',
    //   icon: 'tabler:brand-tabler'
    // },
    // {
    //   title: 'Cards',
    //   icon: 'tabler:id',
    //   children: [
    //     {
    //       title: 'Basic',
    //       path: '/ui/cards/basic'
    //     },
    //     {
    //       title: 'Advanced',
    //       path: '/ui/cards/advanced'
    //     },
    //     {
    //       title: 'Statistics',
    //       path: '/ui/cards/statistics'
    //     },
    //     {
    //       title: 'Widgets',
    //       path: '/ui/cards/widgets'
    //     },
    //     {
    //       title: 'Actions',
    //       path: '/ui/cards/actions'
    //     }
    //   ]
    // },
    // {
    //   badgeContent: '19',
    //   title: 'Components',
    //   icon: 'tabler:archive',
    //   badgeColor: 'primary',
    //   children: [
    //     {
    //       title: 'Accordion',
    //       path: '/components/accordion'
    //     },
    //     {
    //       title: 'Alerts',
    //       path: '/components/alerts'
    //     },
    //     {
    //       title: 'Avatars',
    //       path: '/components/avatars'
    //     },
    //     {
    //       title: 'Badges',
    //       path: '/components/badges'
    //     },
    //     {
    //       title: 'Buttons',
    //       path: '/components/buttons'
    //     },
    //     {
    //       title: 'Button Group',
    //       path: '/components/button-group'
    //     },
    //     {
    //       title: 'Chips',
    //       path: '/components/chips'
    //     },
    //     {
    //       title: 'Dialogs',
    //       path: '/components/dialogs'
    //     },
    //     {
    //       title: 'List',
    //       path: '/components/list'
    //     },
    //     {
    //       title: 'Menu',
    //       path: '/components/menu'
    //     },
    //     {
    //       title: 'Pagination',
    //       path: '/components/pagination'
    //     },
    //     {
    //       title: 'Progress',
    //       path: '/components/progress'
    //     },
    //     {
    //       title: 'Ratings',
    //       path: '/components/ratings'
    //     },
    //     {
    //       title: 'Snackbar',
    //       path: '/components/snackbar'
    //     },
    //     {
    //       title: 'Swiper',
    //       path: '/components/swiper'
    //     },
    //     {
    //       title: 'Tabs',
    //       path: '/components/tabs'
    //     },
    //     {
    //       title: 'Timeline',
    //       path: '/components/timeline'
    //     },
    //     {
    //       title: 'Toasts',
    //       path: '/components/toast'
    //     },
    //     {
    //       title: 'Tree View',
    //       path: '/components/tree-view'
    //     },
    //     {
    //       title: 'More',
    //       path: '/components/more'
    //     }
    //   ]
    // },
    // {
    //   sectionTitle: 'Forms & Tables'
    // },
    // {
    //   title: 'Form Elements',
    //   icon: 'tabler:toggle-left',
    //   children: [
    //     {
    //       title: 'Text Field',
    //       path: '/forms/form-elements/text-field'
    //     },
    //     {
    //       title: 'Select',
    //       path: '/forms/form-elements/select'
    //     },
    //     {
    //       title: 'Checkbox',
    //       path: '/forms/form-elements/checkbox'
    //     },
    //     {
    //       title: 'Radio',
    //       path: '/forms/form-elements/radio'
    //     },
    //     {
    //       title: 'Custom Inputs',
    //       path: '/forms/form-elements/custom-inputs'
    //     },
    //     {
    //       title: 'Textarea',
    //       path: '/forms/form-elements/textarea'
    //     },
    //     {
    //       title: 'Autocomplete',
    //       path: '/forms/form-elements/autocomplete'
    //     },
    //     {
    //       title: 'Date Pickers',
    //       path: '/forms/form-elements/pickers'
    //     },
    //     {
    //       title: 'Switch',
    //       path: '/forms/form-elements/switch'
    //     },
    //     {
    //       title: 'File Uploader',
    //       path: '/forms/form-elements/file-uploader'
    //     },
    //     {
    //       title: 'Editor',
    //       path: '/forms/form-elements/editor'
    //     },
    //     {
    //       title: 'Slider',
    //       path: '/forms/form-elements/slider'
    //     },
    //     {
    //       title: 'Input Mask',
    //       path: '/forms/form-elements/input-mask'
    //     }
    //   ]
    // },
    // {
    //   icon: 'tabler:layout-navbar',
    //   title: 'Form Layouts',
    //   path: '/forms/form-layouts'
    // },
    // {
    //   title: 'Form Validation',
    //   path: '/forms/form-validation',
    //   icon: 'tabler:checkbox'
    // },
    // {
    //   title: 'Form Wizard',
    //   path: '/forms/form-wizard',
    //   icon: 'tabler:text-wrap-disabled'
    // },
    // {
    //   title: 'Table',
    //   icon: 'tabler:table',
    //   path: '/tables/mui'
    // },
    // {
    //   title: 'Mui DataGrid',
    //   icon: 'tabler:layout-grid',
    //   path: '/tables/data-grid'
    // },
    // {
    //   sectionTitle: 'Charts & Misc'
    // },
    // {
    //   title: 'Charts',
    //   icon: 'tabler:chart-pie',
    //   children: [
    //     {
    //       title: 'Apex',
    //       path: '/charts/apex-charts'
    //     },
    //     {
    //       title: 'Recharts',
    //       path: '/charts/recharts'
    //     },
    //     {
    //       title: 'ChartJS',
    //       path: '/charts/chartjs'
    //     }
    //   ]
    // },
    // {
    //   path: '/acl',
    //   action: 'read',
    //   subject: 'acl-page',
    //   icon: 'tabler:shield',
    //   title: 'Access Control'
    // },
    // {
    //   title: 'Others',
    //   icon: 'tabler:dots',
    //   children: [
    //     {
    //       title: 'Menu Levels',
    //       children: [
    //         {
    //           title: 'Menu Level 2.1'
    //         },
    //         {
    //           title: 'Menu Level 2.2',
    //           children: [
    //             {
    //               title: 'Menu Level 3.1'
    //             },
    //             {
    //               title: 'Menu Level 3.2'
    //             }
    //           ]
    //         }
    //       ]
    //     },
    //     {
    //       title: 'Disabled Menu',
    //       disabled: true
    //     },
    //     {
    //       title: 'Raise Support',
    //       externalLink: true,
    //       openInNewTab: true,
    //       path: 'https://pixinvent.ticksy.com/'
    //     },
    //     {
    //       title: 'Documentation',
    //       externalLink: true,
    //       openInNewTab: true,
    //       path: 'https://demos.pixinvent.com/vuexy-nextjs-admin-template/documentation'
    //     }
    //   ]
    // }
  ]
}

export default navigation
