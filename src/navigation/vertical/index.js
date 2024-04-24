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
          path: '/event-management'
        },
        
        {
          title: 'Chấm công',
          path: '/timekeeping'
        },
        {
          path: '/pages/report-month/list',
          title: 'Báo cáo tháng',
          icon: 'tabler:id'
        },
        {
          path: '/pages/access-rights/list',
          title: 'Quyền truy cập',
          icon: 'tabler:shield'
        },
        {
          path: '/pages/access-rights/list',
          title: 'Thống kê',
          icon: 'tabler:statistics/time?tab=%2Fstatistics%2Ftime',

        },
        {
          path: '/pages/access-rights/list',
          title: 'Hẹn lịch',
          icon: 'tabler:guest-registrations'
        },
      ]
    },
    {
      path: '/asset',
      title: 'Hệ thống VMS',
      icon: 'tabler:camera',
      children: [
        {
          title: 'Xem trực tiếp',
          path: 'vms/live-view-p2p'
        },
        {
          title: 'Xem trực tiếp 2',
          path: 'vms/live-view-p2p-private'
        },
        {
          title: 'Xem lại',
          path: 'vms/playback-camera'
        },
        {
          title: 'Nhóm camera',
          path: 'vms/cameraGroup'
        },
        {
          title: 'Sự kiện AI',
          path: 'vms/live-view-p2p-private'
        },
        {
          title: 'Sự cố hệ thống',
          path: 'vms/problems'
        },
        {
          title: 'Danh sách đen',
          path: 'vms/black-list'
        },
        {
          title: 'Cấu hình camera',
          path: '/vms/camera-config'
        },
        {
          title: 'Cấu hình nvr',
          path: '/vms/nvr-config'
        },
        {
          title: 'Quản lý lưu trữ',
          path: 'vms/stores'
        },
        {
          title: 'Thư viện media',
          path: 'vms/library'
        },
        {
          title: 'Bản đồ số',
          path: 'vms/map'
        },
      ]
    },
    {
      title: 'Quản lí người dùng',
      path: 'ota/version-management',
      icon: 'tabler:user',
      children: [
        {
          title: 'Người dùng',
          icon: 'tabler:user',
          path: '/apps/user/list'
        },
        {
          title: 'Cơ cấu tổ chức',
          icon: 'tabler:users',
          path: 'broadcast/local'
        },
        {
          title: 'Vai Trò',
          icon: 'tabler:users',
          path: '/list-policy'
        }

      ]

    },
    {
      title: 'Quản lý hệ thống',
      path: '/alert-management',
      icon: 'tabler:settings-automation',
      children: [
        {
          title: 'Quản lý thiết bị',
          path: '/access-control/devices'
        },
        {
          title: 'Cảnh báo hệ thống',
          path: '/alert-management'
        },
        {
          title: 'OTA',
          path: '/ota/version-management'
        },
        {
          title: 'Logs',
          path: '/alert-management'
        }
      ]
    },
    

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
