#!/bin/bash
set -e

yarn test && yarn test browser
