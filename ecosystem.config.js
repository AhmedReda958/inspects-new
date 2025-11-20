module.exports = {
  apps: [
    {
      name: "inspectex",
      script: "./node_modules/next/dist/bin/next",
      args: "start -p 3008",
      instances: 1,
      exec_mode: "cluster",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: 3008,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
      max_memory_restart: "500M",
      watch: false,
      ignore_watch: ["node_modules", "logs", ".git"],
    },
  ],
};
