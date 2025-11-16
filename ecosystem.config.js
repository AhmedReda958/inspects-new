module.exports = {
  apps: [
    {
      name: "inspectex",
      script: "npm",
      args: "start",
      exec_mode: "cluster",
      instances: "max",
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
