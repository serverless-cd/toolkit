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
export const prInputs = {
  headers: {
    'content-length': '4810',
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
      created_at: '2022-11-23 15:45:51 +0800',
      description: '',
      head_pipeline_id: null,
      id: 1,
      iid: 1,
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
      title: 'Update README.md',
      updated_at: '2022-11-23 15:45:51 +0800',
      updated_by_id: null,
      url: 'http://code.cb6d4506da5914f9e8d5d7f30050ec555.cn-shanghai.alicontainer.com/root/node-express/-/merge_requests/1',
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
      work_in_progress: false,
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
