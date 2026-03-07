#!/bin/bash

# Quick PR Check Script
# Runs validation and provides immediate feedback

set -e

echo "🔍 Quick PR Check"
echo "=================="
echo ""

# Check if there's an open PR
if ! gh pr view &>/dev/null; then
  echo "❌ No open PR found in this repository"
  echo "💡 Create a PR first with: npm run pr"
  exit 1
fi

# Get PR info
PR_NUMBER=$(gh pr view --json number --jq '.number')
PR_TITLE=$(gh pr view --json title --jq '.title')

echo "📋 Analyzing PR #$PR_NUMBER: $PR_TITLE"
echo ""

# Run validation checks
echo "🧪 Running validation checks..."
echo ""

# Lint
echo "1️⃣ Linting..."
if npm run lint --silent; then
  echo "   ✅ Lint passed"
else
  echo "   ❌ Lint failed"
  exit 1
fi

# Tests
echo "2️⃣ Testing..."
if npm run test --silent; then
  echo "   ✅ Tests passed"
else
  echo "   ❌ Tests failed"
  exit 1
fi

# Build
echo "3️⃣ Building..."
if npm run build --silent; then
  echo "   ✅ Build passed"
else
  echo "   ❌ Build failed"
  exit 1
fi

echo ""
echo "✅ All validation checks passed!"
echo ""

# Get changed files count
FILES_CHANGED=$(gh pr view --json files --jq '.files | length')
echo "📊 PR Summary:"
echo "   • Files changed: $FILES_CHANGED"
echo "   • Status: Ready for review"
echo ""

# Check for common patterns
echo "🔍 Quick code scan..."

# Check for console.log (should use proper logging)
if git diff main --name-only | grep -E '\.(ts|tsx|js|jsx)$' | xargs grep -l "console\.log" 2>/dev/null; then
  echo "   ⚠️  Found console.log statements (consider removing for production)"
fi

# Check for TODO comments
TODO_COUNT=$(git diff main --name-only | grep -E '\.(ts|tsx|js|jsx)$' | xargs grep -c "TODO\|FIXME" 2>/dev/null | awk -F: '{sum+=$2} END {print sum}')
if [ "$TODO_COUNT" -gt 0 ]; then
  echo "   ℹ️  Found $TODO_COUNT TODO/FIXME comments"
fi

# Check for test files
TEST_FILES=$(git diff main --name-only | grep -E '\.test\.(ts|tsx)$' | wc -l)
if [ "$TEST_FILES" -eq 0 ]; then
  echo "   ⚠️  No test files added (consider adding tests)"
fi

echo ""
echo "🎉 PR is ready for review!"
echo "💡 Next steps:"
echo "   • Review the changes: gh pr view --web"
echo "   • Request reviews: gh pr edit --add-reviewer username"
echo "   • Merge when approved: gh pr merge"
