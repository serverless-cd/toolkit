export const pushWithBranch = {
  headers: {
    'content-length': '1597',
    'content-type': 'application/json',
    host: 'test-serverls-cd-shl-fzgonuvwzt.cn-hongkong.fcapp.run',
    'user-agent': 'GitLab/14.1.0',
    'x-forwarded-proto': 'https',
    'x-gitlab-event': 'Job Hook',
    'x-gitlab-token': 'shl123',
  },
  body: {
    object_kind: 'build',
    ref: 'master',
    tag: false,
    before_sha: 'eaa483371ab479f4ec8a730700c0664a7fa91aa2',
    sha: '11f3b6b360d8ae4e5f71ec36422a5b776df02896',
    build_id: 4,
    build_name: 'eslint-sast',
    build_stage: 'test',
    build_status: 'created',
    build_created_at: '2022-11-23 15:27:32 +0800',
    build_started_at: null,
    build_finished_at: null,
    build_duration: null,
    build_queued_duration: null,
    build_allow_failure: true,
    build_failure_reason: 'unknown_failure',
    pipeline_id: 1,
    runner: null,
    project_id: 2,
    project_name: 'Administrator / node-express',
    user: {
      id: 1,
      name: 'Administrator',
      username: 'root',
      avatar_url:
        'https://www.gravatar.com/avatar/e52a08688eff32719cb02c8d6ec4ead3?s=80&d=identicon',
      email: 'serverles-cd@163.com',
    },
    commit: {
      id: 1,
      sha: '11f3b6b360d8ae4e5f71ec36422a5b776df02896',
      message: 'Update README.md',
      author_name: 'Administrator',
      author_email: 'serverles-cd@163.com',
      author_url: 'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root',
      status: 'pending',
      duration: null,
      started_at: null,
      finished_at: null,
    },
    repository: {
      name: 'node-express',
      url: 'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
      description: null,
      homepage:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
      git_http_url:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
      git_ssh_url:
        'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
      visibility_level: 10,
    },
    environment: null,
  },
};

export const pushWithBranch15 = {
  headers: {
    accept: '*/*',
    'accept-encoding': 'gzip;q=1.0,deflate;q=0.6,identity;q=0.3',
    'content-length': '2832',
    'content-type': 'application/json',
    host: 'appcenterhooksv-fc-cons-service-gfzgdxgzjg.ap-southeast-1.fcapp.run',
    'user-agent': 'GitLab/15.7.0-pre',
    'x-forwarded-proto': 'https',
    'x-gitlab-event': 'Push Hook',
    'x-gitlab-event-uuid': '0b40ce7b-e09f-43cc-87af-68e3c6a3644f',
    'x-gitlab-instance': 'https://gitlab.com',
    'x-gitlab-token': 'serverless-devs',
  },
  body: {
    object_kind: 'push',
    event_name: 'push',
    before: '1f5f5d6d1dcf4904b61f8d39ef32067e10ae2238',
    after: '25b702b4f846d523d23ef6cedcb30dd12c3a24a3',
    ref: 'refs/heads/6348-feat',
    checkout_sha: '25b702b4f846d523d23ef6cedcb30dd12c3a24a3',
    message: null,
    user_id: 1681820,
    user_name: '2ni',
    user_username: '2ni',
    user_email: '',
    user_avatar: 'https://gitlab.com/uploads/-/system/user/avatar/1681820/avatar.png',
    project_id: 3499914,
    project: {
      id: 3499914,
      name: 'Zsqk',
      description: '团队协作. ',
      web_url: 'https://gitlab.com/zsqk/Zsqk',
      avatar_url: null,
      git_ssh_url: 'git@gitlab.com:zsqk/Zsqk.git',
      git_http_url: 'https://gitlab.com/zsqk/Zsqk.git',
      namespace: 'zsqk',
      visibility_level: 0,
      path_with_namespace: 'zsqk/Zsqk',
      default_branch: 'master',
      ci_config_path: null,
      homepage: 'https://gitlab.com/zsqk/Zsqk',
      url: 'git@gitlab.com:zsqk/Zsqk.git',
      ssh_url: 'git@gitlab.com:zsqk/Zsqk.git',
      http_url: 'https://gitlab.com/zsqk/Zsqk.git',
    },
    commits: [
      {
        id: 'ba1fccdb21c7362e9f04d4a498f2a31f86a04671',
        message: 'opt: 更新中间层,代码警告处理\n',
        title: 'opt: 更新中间层,代码警告处理',
        timestamp: '2022-12-20T18:00:32+08:00',
        url: 'https://gitlab.com/zsqk/Zsqk/-/commit/ba1fccdb21c7362e9f04d4a498f2a31f86a04671',
        author: {
          name: '2ni',
          email: 'vows@me.com',
        },
        added: [],
        modified: [
          'program/gmall-pwa-web/package-lock.json',
          'program/gmall-pwa-web/src/components/PendingGmallOrderList.tsx',
          'program/gmall-pwa-web/src/components/Store-settings/DisplayInformation/DisplayInformation.tsx',
          'program/gmall-pwa-web/src/components/Store-settings/StoreInfo/Edit.tsx',
          'program/gmall-pwa-web/src/components/Store-settings/StoreInfo/StoreInfo.tsx',
        ],
        removed: [],
      },
      {
        id: '086d15d5ceb1aeceb0bcd9c8e279c081ce891fc3',
        message: 'feat: 新增 商城订单管理页面\n',
        title: 'feat: 新增 商城订单管理页面',
        timestamp: '2022-12-20T20:04:00+08:00',
        url: 'https://gitlab.com/zsqk/Zsqk/-/commit/086d15d5ceb1aeceb0bcd9c8e279c081ce891fc3',
        author: {
          name: '2ni',
          email: 'vows@me.com',
        },
        added: ['program/gmall-pwa-web/src/pages/path-i/gmall/order-management.tsx'],
        modified: [],
        removed: [],
      },
      {
        id: '25b702b4f846d523d23ef6cedcb30dd12c3a24a3',
        message: 'opt: 新增模拟数据及 API 数据类型\n',
        title: 'opt: 新增模拟数据及 API 数据类型',
        timestamp: '2022-12-20T20:05:20+08:00',
        url: 'https://gitlab.com/zsqk/Zsqk/-/commit/25b702b4f846d523d23ef6cedcb30dd12c3a24a3',
        author: {
          name: '2ni',
          email: 'vows@me.com',
        },
        added: [],
        modified: ['program/gmall-pwa-web/src/pages/path-i/gmall/order-management.tsx'],
        removed: [],
      },
    ],
    total_commits_count: 3,
    push_options: {},
    repository: {
      name: 'Zsqk',
      url: 'git@gitlab.com:zsqk/Zsqk.git',
      description: '团队协作. ',
      homepage: 'https://gitlab.com/zsqk/Zsqk',
      git_http_url: 'https://gitlab.com/zsqk/Zsqk.git',
      git_ssh_url: 'git@gitlab.com:zsqk/Zsqk.git',
      visibility_level: 0,
    },
  },
};

export const pushWithTag = {
  headers: {
    'content-length': '1599',
    'content-type': 'application/json',
    host: 'test-serverls-cd-shl-fzgonuvwzt.cn-hongkong.fcapp.run',
    'user-agent': 'GitLab/14.1.0',
    'x-forwarded-proto': 'https',
    'x-gitlab-event': 'Job Hook',
    'x-gitlab-token': 'shl123',
  },
  body: {
    object_kind: 'build',
    ref: 'v0.0.1',
    tag: true,
    before_sha: '0000000000000000000000000000000000000000',
    sha: '11f3b6b360d8ae4e5f71ec36422a5b776df02896',
    build_id: 8,
    build_name: 'build',
    build_stage: 'build',
    build_status: 'pending',
    build_created_at: '2022-11-23 15:36:44 +0800',
    build_started_at: null,
    build_finished_at: null,
    build_duration: null,
    build_queued_duration: 3.651710271,
    build_allow_failure: false,
    build_failure_reason: 'unknown_failure',
    pipeline_id: 2,
    runner: null,
    project_id: 2,
    project_name: 'Administrator / node-express',
    user: {
      id: 1,
      name: 'Administrator',
      username: 'root',
      avatar_url:
        'https://www.gravatar.com/avatar/e52a08688eff32719cb02c8d6ec4ead3?s=80&d=identicon',
      email: 'serverles-cd@163.com',
    },
    commit: {
      id: 2,
      sha: '11f3b6b360d8ae4e5f71ec36422a5b776df02896',
      message: 'Update README.md',
      author_name: 'Administrator',
      author_email: 'serverles-cd@163.com',
      author_url: 'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root',
      status: 'pending',
      duration: null,
      started_at: null,
      finished_at: null,
    },
    repository: {
      name: 'node-express',
      url: 'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
      description: null,
      homepage:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
      git_http_url:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
      git_ssh_url:
        'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
      visibility_level: 10,
    },
    environment: null,
  },
};
export const prWithOpened = {
  headers: {
    'content-length': '4803',
    'content-type': 'application/json',
    host: 'test-serverls-cd-shl-fzgonuvwzt.cn-hongkong.fcapp.run',
    'user-agent': 'GitLab/14.1.0',
    'x-forwarded-proto': 'https',
    'x-gitlab-event': 'Merge Request Hook',
    'x-gitlab-token': 'shl123',
  },
  body: {
    object_kind: 'merge_request',
    event_type: 'merge_request',
    user: {
      id: 1,
      name: 'Administrator',
      username: 'root',
      avatar_url:
        'https://www.gravatar.com/avatar/e52a08688eff32719cb02c8d6ec4ead3?s=80&d=identicon',
      email: 'serverles-cd@163.com',
    },
    project: {
      id: 2,
      name: 'node-express',
      description: null,
      web_url:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
      avatar_url: null,
      git_ssh_url:
        'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
      git_http_url:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
      namespace: 'Administrator',
      visibility_level: 10,
      path_with_namespace: 'root/node-express',
      default_branch: 'master',
      ci_config_path: null,
      homepage:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
      url: 'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
      ssh_url:
        'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
      http_url:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
    },
    object_attributes: {
      assignee_id: null,
      author_id: 1,
      created_at: '2022-11-29 15:56:37 +0800',
      description: '',
      head_pipeline_id: null,
      id: 2,
      iid: 2,
      last_edited_at: null,
      last_edited_by_id: null,
      merge_commit_sha: null,
      merge_error: null,
      merge_params: {
        force_remove_source_branch: '0',
      },
      merge_status: 'preparing',
      merge_user_id: null,
      merge_when_pipeline_succeeds: false,
      milestone_id: null,
      source_branch: 'dev',
      source_project_id: 2,
      state_id: 1,
      target_branch: 'master',
      target_project_id: 2,
      time_estimate: 0,
      title: 'Draft: Dev',
      updated_at: '2022-11-29 15:56:37 +0800',
      updated_by_id: null,
      url: 'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express/-/merge_requests/2',
      source: {
        id: 2,
        name: 'node-express',
        description: null,
        web_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
        avatar_url: null,
        git_ssh_url:
          'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        git_http_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
        namespace: 'Administrator',
        visibility_level: 10,
        path_with_namespace: 'root/node-express',
        default_branch: 'master',
        ci_config_path: null,
        homepage:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
        url: 'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        ssh_url:
          'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        http_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
      },
      target: {
        id: 2,
        name: 'node-express',
        description: null,
        web_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
        avatar_url: null,
        git_ssh_url:
          'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        git_http_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
        namespace: 'Administrator',
        visibility_level: 10,
        path_with_namespace: 'root/node-express',
        default_branch: 'master',
        ci_config_path: null,
        homepage:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
        url: 'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        ssh_url:
          'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        http_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
      },
      last_commit: {
        id: '5cf5b0919f0337ee695c608212d3e3c2dc794b64',
        message: 'Update README.md',
        title: 'Update README.md',
        timestamp: '2022-11-23T15:45:13+08:00',
        url: 'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express/-/commit/5cf5b0919f0337ee695c608212d3e3c2dc794b64',
        author: {
          name: 'Administrator',
          email: 'serverles-cd@163.com',
        },
      },
      work_in_progress: true,
      total_time_spent: 0,
      time_change: 0,
      human_total_time_spent: null,
      human_time_change: null,
      human_time_estimate: null,
      assignee_ids: [],
      state: 'opened',
      action: 'open',
    },
    labels: [],
    changes: {
      merge_status: {
        previous: 'unchecked',
        current: 'preparing',
      },
    },
    repository: {
      name: 'node-express',
      url: 'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
      description: null,
      homepage:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
    },
  },
};

export const prWithClosed = {
  headers: {
    'content-length': '4879',
    'content-type': 'application/json',
    host: 'test-serverls-cd-shl-fzgonuvwzt.cn-hongkong.fcapp.run',
    'user-agent': 'GitLab/14.1.0',
    'x-forwarded-proto': 'https',
    'x-gitlab-event': 'Merge Request Hook',
    'x-gitlab-token': 'shl123',
  },
  body: {
    object_kind: 'merge_request',
    event_type: 'merge_request',
    user: {
      id: 1,
      name: 'Administrator',
      username: 'root',
      avatar_url:
        'https://www.gravatar.com/avatar/e52a08688eff32719cb02c8d6ec4ead3?s=80&d=identicon',
      email: 'serverles-cd@163.com',
    },
    project: {
      id: 2,
      name: 'node-express',
      description: null,
      web_url:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
      avatar_url: null,
      git_ssh_url:
        'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
      git_http_url:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
      namespace: 'Administrator',
      visibility_level: 10,
      path_with_namespace: 'root/node-express',
      default_branch: 'master',
      ci_config_path: null,
      homepage:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
      url: 'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
      ssh_url:
        'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
      http_url:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
    },
    object_attributes: {
      assignee_id: null,
      author_id: 1,
      created_at: '2022-11-29 15:56:37 +0800',
      description: '',
      head_pipeline_id: null,
      id: 2,
      iid: 2,
      last_edited_at: null,
      last_edited_by_id: null,
      merge_commit_sha: null,
      merge_error: null,
      merge_params: {
        force_remove_source_branch: '0',
      },
      merge_status: 'cannot_be_merged',
      merge_user_id: null,
      merge_when_pipeline_succeeds: false,
      milestone_id: null,
      source_branch: 'dev',
      source_project_id: 2,
      state_id: 2,
      target_branch: 'master',
      target_project_id: 2,
      time_estimate: 0,
      title: 'Draft: Dev',
      updated_at: '2022-11-29 16:05:46 +0800',
      updated_by_id: null,
      url: 'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express/-/merge_requests/2',
      source: {
        id: 2,
        name: 'node-express',
        description: null,
        web_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
        avatar_url: null,
        git_ssh_url:
          'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        git_http_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
        namespace: 'Administrator',
        visibility_level: 10,
        path_with_namespace: 'root/node-express',
        default_branch: 'master',
        ci_config_path: null,
        homepage:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
        url: 'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        ssh_url:
          'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        http_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
      },
      target: {
        id: 2,
        name: 'node-express',
        description: null,
        web_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
        avatar_url: null,
        git_ssh_url:
          'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        git_http_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
        namespace: 'Administrator',
        visibility_level: 10,
        path_with_namespace: 'root/node-express',
        default_branch: 'master',
        ci_config_path: null,
        homepage:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
        url: 'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        ssh_url:
          'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        http_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
      },
      last_commit: {
        id: '5cf5b0919f0337ee695c608212d3e3c2dc794b64',
        message: 'Update README.md',
        title: 'Update README.md',
        timestamp: '2022-11-23T15:45:13+08:00',
        url: 'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express/-/commit/5cf5b0919f0337ee695c608212d3e3c2dc794b64',
        author: {
          name: 'Administrator',
          email: 'serverles-cd@163.com',
        },
      },
      work_in_progress: true,
      total_time_spent: 0,
      time_change: 0,
      human_total_time_spent: null,
      human_time_change: null,
      human_time_estimate: null,
      assignee_ids: [],
      state: 'closed',
      action: 'close',
    },
    labels: [],
    changes: {
      state_id: {
        previous: 1,
        current: 2,
      },
      updated_at: {
        previous: '2022-11-29 15:56:37 +0800',
        current: '2022-11-29 16:05:46 +0800',
      },
    },
    repository: {
      name: 'node-express',
      url: 'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
      description: null,
      homepage:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
    },
  },
};

export const prWithReopened = {
  headers: {
    'content-length': '4880',
    'content-type': 'application/json',
    host: 'test-serverls-cd-shl-fzgonuvwzt.cn-hongkong.fcapp.run',
    'user-agent': 'GitLab/14.1.0',
    'x-forwarded-proto': 'https',
    'x-gitlab-event': 'Merge Request Hook',
    'x-gitlab-token': 'shl123',
  },
  body: {
    object_kind: 'merge_request',
    event_type: 'merge_request',
    user: {
      id: 1,
      name: 'Administrator',
      username: 'root',
      avatar_url:
        'https://www.gravatar.com/avatar/e52a08688eff32719cb02c8d6ec4ead3?s=80&d=identicon',
      email: 'serverles-cd@163.com',
    },
    project: {
      id: 2,
      name: 'node-express',
      description: null,
      web_url:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
      avatar_url: null,
      git_ssh_url:
        'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
      git_http_url:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
      namespace: 'Administrator',
      visibility_level: 10,
      path_with_namespace: 'root/node-express',
      default_branch: 'master',
      ci_config_path: null,
      homepage:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
      url: 'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
      ssh_url:
        'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
      http_url:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
    },
    object_attributes: {
      assignee_id: null,
      author_id: 1,
      created_at: '2022-11-29 15:56:37 +0800',
      description: '',
      head_pipeline_id: null,
      id: 2,
      iid: 2,
      last_edited_at: null,
      last_edited_by_id: null,
      merge_commit_sha: null,
      merge_error: null,
      merge_params: {
        force_remove_source_branch: '0',
      },
      merge_status: 'cannot_be_merged',
      merge_user_id: null,
      merge_when_pipeline_succeeds: false,
      milestone_id: null,
      source_branch: 'dev',
      source_project_id: 2,
      state_id: 1,
      target_branch: 'master',
      target_project_id: 2,
      time_estimate: 0,
      title: 'Draft: Dev',
      updated_at: '2022-11-29 16:07:02 +0800',
      updated_by_id: null,
      url: 'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express/-/merge_requests/2',
      source: {
        id: 2,
        name: 'node-express',
        description: null,
        web_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
        avatar_url: null,
        git_ssh_url:
          'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        git_http_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
        namespace: 'Administrator',
        visibility_level: 10,
        path_with_namespace: 'root/node-express',
        default_branch: 'master',
        ci_config_path: null,
        homepage:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
        url: 'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        ssh_url:
          'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        http_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
      },
      target: {
        id: 2,
        name: 'node-express',
        description: null,
        web_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
        avatar_url: null,
        git_ssh_url:
          'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        git_http_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
        namespace: 'Administrator',
        visibility_level: 10,
        path_with_namespace: 'root/node-express',
        default_branch: 'master',
        ci_config_path: null,
        homepage:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
        url: 'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        ssh_url:
          'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        http_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
      },
      last_commit: {
        id: '5cf5b0919f0337ee695c608212d3e3c2dc794b64',
        message: 'Update README.md',
        title: 'Update README.md',
        timestamp: '2022-11-23T15:45:13+08:00',
        url: 'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express/-/commit/5cf5b0919f0337ee695c608212d3e3c2dc794b64',
        author: {
          name: 'Administrator',
          email: 'serverles-cd@163.com',
        },
      },
      work_in_progress: true,
      total_time_spent: 0,
      time_change: 0,
      human_total_time_spent: null,
      human_time_change: null,
      human_time_estimate: null,
      assignee_ids: [],
      state: 'opened',
      action: 'reopen',
    },
    labels: [],
    changes: {
      state_id: {
        previous: 2,
        current: 1,
      },
      updated_at: {
        previous: '2022-11-29 16:05:46 +0800',
        current: '2022-11-29 16:07:02 +0800',
      },
    },
    repository: {
      name: 'node-express',
      url: 'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
      description: null,
      homepage:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
    },
  },
};

export const prWithMerged = {
  headers: {
    'content-length': '4917',
    'content-type': 'application/json',
    host: 'test-serverls-cd-shl-fzgonuvwzt.cn-hongkong.fcapp.run',
    'user-agent': 'GitLab/14.1.0',
    'x-forwarded-proto': 'https',
    'x-gitlab-event': 'Merge Request Hook',
    'x-gitlab-token': 'shl123',
  },
  body: {
    object_kind: 'merge_request',
    event_type: 'merge_request',
    user: {
      id: 1,
      name: 'Administrator',
      username: 'root',
      avatar_url:
        'https://www.gravatar.com/avatar/e52a08688eff32719cb02c8d6ec4ead3?s=80&d=identicon',
      email: 'serverles-cd@163.com',
    },
    project: {
      id: 2,
      name: 'node-express',
      description: null,
      web_url:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
      avatar_url: null,
      git_ssh_url:
        'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
      git_http_url:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
      namespace: 'Administrator',
      visibility_level: 10,
      path_with_namespace: 'root/node-express',
      default_branch: 'master',
      ci_config_path: null,
      homepage:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
      url: 'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
      ssh_url:
        'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
      http_url:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
    },
    object_attributes: {
      assignee_id: null,
      author_id: 1,
      created_at: '2022-11-29 15:56:37 +0800',
      description: '',
      head_pipeline_id: null,
      id: 2,
      iid: 2,
      last_edited_at: '2022-11-29 16:08:21 +0800',
      last_edited_by_id: 1,
      merge_commit_sha: 'f3fa5f2fa1b4ae580e694224fcc02f322a5deebf',
      merge_error: null,
      merge_params: {
        force_remove_source_branch: '0',
      },
      merge_status: 'can_be_merged',
      merge_user_id: null,
      merge_when_pipeline_succeeds: false,
      milestone_id: null,
      source_branch: 'dev',
      source_project_id: 2,
      state_id: 3,
      target_branch: 'master',
      target_project_id: 2,
      time_estimate: 0,
      title: 'Dev',
      updated_at: '2022-11-29 16:10:57 +0800',
      updated_by_id: 1,
      url: 'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express/-/merge_requests/2',
      source: {
        id: 2,
        name: 'node-express',
        description: null,
        web_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
        avatar_url: null,
        git_ssh_url:
          'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        git_http_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
        namespace: 'Administrator',
        visibility_level: 10,
        path_with_namespace: 'root/node-express',
        default_branch: 'master',
        ci_config_path: null,
        homepage:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
        url: 'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        ssh_url:
          'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        http_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
      },
      target: {
        id: 2,
        name: 'node-express',
        description: null,
        web_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
        avatar_url: null,
        git_ssh_url:
          'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        git_http_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
        namespace: 'Administrator',
        visibility_level: 10,
        path_with_namespace: 'root/node-express',
        default_branch: 'master',
        ci_config_path: null,
        homepage:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
        url: 'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        ssh_url:
          'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
        http_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express.git',
      },
      last_commit: {
        id: 'f6c0ed3322718e95e151c9f187e02e8e60cd2834',
        message: 'Add new file',
        title: 'Add new file',
        timestamp: '2022-11-29T16:09:58+08:00',
        url: 'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express/-/commit/f6c0ed3322718e95e151c9f187e02e8e60cd2834',
        author: {
          name: 'Administrator',
          email: 'serverles-cd@163.com',
        },
      },
      work_in_progress: false,
      total_time_spent: 0,
      time_change: 0,
      human_total_time_spent: null,
      human_time_change: null,
      human_time_estimate: null,
      assignee_ids: [],
      state: 'merged',
      action: 'merge',
    },
    labels: [],
    changes: {
      state_id: {
        previous: 4,
        current: 3,
      },
      updated_at: {
        previous: '2022-11-29 16:10:57 +0800',
        current: '2022-11-29 16:10:57 +0800',
      },
    },
    repository: {
      name: 'node-express',
      url: 'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/node-express.git',
      description: null,
      homepage:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express',
    },
  },
};

export const prWithMerged1 = {
  headers: {
    'content-length': '5577',
    'content-type': 'application/json',
    host: 'appcenterhooksv-fc-cons-service-gfzgdxgzjg.ap-southeast-1.fcapp.run',
    'user-agent': 'GitLab/14.1.0',
    'x-forwarded-proto': 'https',
    'x-gitlab-event': 'Merge Request Hook',
    'x-gitlab-token': 'serverless-devs',
  },
  body: {
    object_kind: 'merge_request',
    event_type: 'merge_request',
    user: {
      id: 1,
      name: 'Administrator',
      username: 'root',
      avatar_url:
        'https://www.gravatar.com/avatar/e52a08688eff32719cb02c8d6ec4ead3?s=80&d=identicon',
      email: 'serverles-cd@163.com',
    },
    project: {
      id: 8,
      name: 'start-django-tyqt',
      description:
        'Django是一个开放源代码的Web应用框架，由Python写成。采用了MTV的框架模式，即模型M，视图V和模版T',
      web_url:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/start-django-tyqt',
      avatar_url: null,
      git_ssh_url:
        'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/start-django-tyqt.git',
      git_http_url:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/start-django-tyqt.git',
      namespace: 'Administrator',
      visibility_level: 0,
      path_with_namespace: 'root/start-django-tyqt',
      default_branch: 'master',
      ci_config_path: null,
      homepage:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/start-django-tyqt',
      url: 'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/start-django-tyqt.git',
      ssh_url:
        'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/start-django-tyqt.git',
      http_url:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/start-django-tyqt.git',
    },
    object_attributes: {
      assignee_id: null,
      author_id: 1,
      created_at: '2022-12-21 09:46:16 +0800',
      description: '',
      head_pipeline_id: null,
      id: 4,
      iid: 1,
      last_edited_at: null,
      last_edited_by_id: null,
      merge_commit_sha: '52e1e9084304509220fe27a0b434b8cdb658cbdc',
      merge_error: null,
      merge_params: {
        force_remove_source_branch: '1',
      },
      merge_status: 'can_be_merged',
      merge_user_id: null,
      merge_when_pipeline_succeeds: false,
      milestone_id: null,
      source_branch: 'dev',
      source_project_id: 8,
      state_id: 3,
      target_branch: 'master',
      target_project_id: 8,
      time_estimate: 0,
      title: 'Update s.yaml',
      updated_at: '2022-12-21 09:46:27 +0800',
      updated_by_id: null,
      url: 'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/start-django-tyqt/-/merge_requests/1',
      source: {
        id: 8,
        name: 'start-django-tyqt',
        description:
          'Django是一个开放源代码的Web应用框架，由Python写成。采用了MTV的框架模式，即模型M，视图V和模版T',
        web_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/start-django-tyqt',
        avatar_url: null,
        git_ssh_url:
          'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/start-django-tyqt.git',
        git_http_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/start-django-tyqt.git',
        namespace: 'Administrator',
        visibility_level: 0,
        path_with_namespace: 'root/start-django-tyqt',
        default_branch: 'master',
        ci_config_path: null,
        homepage:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/start-django-tyqt',
        url: 'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/start-django-tyqt.git',
        ssh_url:
          'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/start-django-tyqt.git',
        http_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/start-django-tyqt.git',
      },
      target: {
        id: 8,
        name: 'start-django-tyqt',
        description:
          'Django是一个开放源代码的Web应用框架，由Python写成。采用了MTV的框架模式，即模型M，视图V和模版T',
        web_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/start-django-tyqt',
        avatar_url: null,
        git_ssh_url:
          'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/start-django-tyqt.git',
        git_http_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/start-django-tyqt.git',
        namespace: 'Administrator',
        visibility_level: 0,
        path_with_namespace: 'root/start-django-tyqt',
        default_branch: 'master',
        ci_config_path: null,
        homepage:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/start-django-tyqt',
        url: 'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/start-django-tyqt.git',
        ssh_url:
          'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/start-django-tyqt.git',
        http_url:
          'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/start-django-tyqt.git',
      },
      last_commit: {
        id: '7a9466a3828b0c742ad7e08b11edcff57ed3aa82',
        message: 'Update s.yaml',
        title: 'Update s.yaml',
        timestamp: '2022-12-21T09:45:52+08:00',
        url: 'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/start-django-tyqt/-/commit/7a9466a3828b0c742ad7e08b11edcff57ed3aa82',
        author: {
          name: 'Administrator',
          email: 'serverles-cd@163.com',
        },
      },
      work_in_progress: false,
      total_time_spent: 0,
      time_change: 0,
      human_total_time_spent: null,
      human_time_change: null,
      human_time_estimate: null,
      assignee_ids: [],
      state: 'merged',
      action: 'merge',
    },
    labels: [],
    changes: {
      state_id: {
        previous: 4,
        current: 3,
      },
      updated_at: {
        previous: '2022-12-21 09:46:27 +0800',
        current: '2022-12-21 09:46:27 +0800',
      },
    },
    repository: {
      name: 'start-django-tyqt',
      url: 'git@code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com:root/start-django-tyqt.git',
      description:
        'Django是一个开放源代码的Web应用框架，由Python写成。采用了MTV的框架模式，即模型M，视图V和模版T',
      homepage:
        'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/start-django-tyqt',
    },
  },
};

export const DataWithNoUserAgent = {
  headers: {
    'content-length': '2521',
    'content-type': 'application/json',
    host: 'appcenterhooksv-fc-cons-service-gfzgdxgzjg.ap-southeast-1.fcapp.run',
    'x-forwarded-proto': 'https',
    'x-gitlab-event': 'Push Hook',
    'x-gitlab-token': 'serverless-devs',
  },
  body: {
    object_kind: 'push',
    event_name: 'push',
    before: '23aebfad0560a31abfb40f7460a0eae131495c2a',
    after: '505113a53f3e4f34bb92d88e81f2b44228b3d7f9',
    ref: 'refs/heads/master',
    checkout_sha: '505113a53f3e4f34bb92d88e81f2b44228b3d7f9',
    message: null,
    user_id: 473,
    user_name: 'amall-fc',
    user_username: 'amall-fc',
    user_email: '',
    user_avatar:
      'https://www.gravatar.com/avatar/f3975a8978bcf7543bdd29cb9994a659?s=80&d=identicon',
    project_id: 2095,
    project: {
      id: 2095,
      name: 'amall-assistant',
      description: '',
      web_url: 'http://git.greedyint.com/amall-fc/amall-assistant',
      avatar_url: null,
      git_ssh_url: 'git@git.greedyint.com:amall-fc/amall-assistant.git',
      git_http_url: 'http://git.greedyint.com/amall-fc/amall-assistant.git',
      namespace: 'amall-fc',
      visibility_level: 0,
      path_with_namespace: 'amall-fc/amall-assistant',
      default_branch: 'master',
      ci_config_path: '',
      homepage: 'http://git.greedyint.com/amall-fc/amall-assistant',
      url: 'git@git.greedyint.com:amall-fc/amall-assistant.git',
      ssh_url: 'git@git.greedyint.com:amall-fc/amall-assistant.git',
      http_url: 'http://git.greedyint.com/amall-fc/amall-assistant.git',
    },
    commits: [
      {
        id: '505113a53f3e4f34bb92d88e81f2b44228b3d7f9',
        message: 'Update s.yaml 指定镜像源',
        timestamp: '2023-03-30T10:09:04Z',
        url: 'http://git.greedyint.com/amall-fc/amall-assistant/commit/505113a53f3e4f34bb92d88e81f2b44228b3d7f9',
        author: { name: 'xuefang', email: 'xuefang.liang@xiaobao100.com' },
        added: [],
        modified: ['s.yaml'],
        removed: [],
      },
      {
        id: '2bc4de9e7a5107a2d62a64042cf2b98a00adb15b',
        message: '添加镜像源',
        timestamp: '2023-03-30T09:49:28Z',
        url: 'http://git.greedyint.com/amall-fc/amall-assistant/commit/2bc4de9e7a5107a2d62a64042cf2b98a00adb15b',
        author: { name: 'amall-fc', email: 'amall-fc@xiaobao100.com' },
        added: [],
        modified: ['s.yaml'],
        removed: [],
      },
      {
        id: '23aebfad0560a31abfb40f7460a0eae131495c2a',
        message: '指定地址和端口\n',
        timestamp: '2023-03-29T07:52:12Z',
        url: 'http://git.greedyint.com/amall-fc/amall-assistant/commit/23aebfad0560a31abfb40f7460a0eae131495c2a',
        author: { name: 'Bin Xiang', email: 'xiangbin731@msn.com' },
        added: [],
        modified: ['Dockerfile'],
        removed: [],
      },
    ],
    total_commits_count: 3,
    push_options: {},
    repository: {
      name: 'amall-assistant',
      url: 'git@git.greedyint.com:amall-fc/amall-assistant.git',
      description: '',
      homepage: 'http://git.greedyint.com/amall-fc/amall-assistant',
      git_http_url: 'http://git.greedyint.com/amall-fc/amall-assistant.git',
      git_ssh_url: 'git@git.greedyint.com:amall-fc/amall-assistant.git',
      visibility_level: 0,
    },
  },
};
