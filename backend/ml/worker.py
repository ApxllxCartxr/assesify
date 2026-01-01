"""Minimal RQ worker launcher for local development.

Usage:
  # Run a worker that listens on the 'ml-tasks' queue
  python -m ml.worker

This uses RQ and expects REDIS_URL in env or defaults to redis://localhost:6379/0
"""
from __future__ import annotations

import os
from rq import Queue, Worker, Connection
import redis

listen = ["ml-tasks"]

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")

conn = redis.from_url(redis_url)

if __name__ == "__main__":
    with Connection(conn):
        q = Queue("ml-tasks")
        print("Starting worker listening on ml-tasks queue...")
        Worker(q).work()
