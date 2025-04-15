import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const GITHUB_TOKEN = process.env.GITHUB_ACCESS_TOKEN;

export async function POST(request) {
  try {
    // Get API key from header
    const apiKey = request.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'API key is required'
      }, { status: 401 });
    }

    // Validate the API key
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, active, usage')
      .eq('key', apiKey)
      .single();

    if (error || !data || !data.active) {
      console.error('Error validating API key:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid or inactive API key' 
      }, { status: 401 });
    }

    // Extract request body
    const body = await request.json();
    const { githubUrl } = body;

    if (!githubUrl) {
      return NextResponse.json({ 
        success: false, 
        error: 'GitHub URL is required' 
      }, { status: 400 });
    }

    // Validate GitHub URL format
    if (!isValidGitHubUrl(githubUrl)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid GitHub URL format. Please provide a valid GitHub repository URL (e.g., https://github.com/owner/repo)'
      }, { status: 400 });
    }

    // Increment the usage count
    const { error: updateError } = await supabase
      .from('api_keys')
      .update({ usage: (data.usage || 0) + 1 })
      .eq('id', data.id);

    if (updateError) {
      console.error('Error updating usage count:', updateError);
    }

    // Get README content
    const readmeContent = await getGitHubReadme(githubUrl);

    return NextResponse.json({
      success: true,
      data: {
        readme: readmeContent,
        url: githubUrl,
      }
    });

  } catch (error) {
    console.error('Error in github-summarizer route:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}

function isValidGitHubUrl(url) {
  try {
    const githubUrlPattern = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/;
    return githubUrlPattern.test(url);
  } catch {
    return false;
  }
}

async function getGitHubReadme(githubUrl) {
  try {
    // Parse the GitHub URL to extract owner and repo
    const urlParts = githubUrl.replace('https://github.com/', '').split('/');
    if (urlParts.length !== 2) {
      throw new Error('Invalid GitHub repository URL format');
    }

    const owner = urlParts[0];
    const repo = urlParts[1];

    // Common headers for GitHub API requests
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Readme-Fetcher'
    };

    // Add authorization if token is available
    if (GITHUB_TOKEN) {
      headers.Authorization = `token ${GITHUB_TOKEN}`;
    }

    // First, try to get the default branch
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
    console.log('Fetching repo info from:', apiUrl);
    
    const repoResponse = await fetch(apiUrl, { headers });

    if (!repoResponse.ok) {
      const errorText = await repoResponse.text();
      console.error('Failed to fetch repo info:', errorText);
      throw new Error(`Repository not found or not accessible: ${owner}/${repo}`);
    }

    const repoData = await repoResponse.json();
    const defaultBranch = repoData.default_branch;
    console.log('Default branch:', defaultBranch);

    // Try to get the README content directly from the GitHub API
    const contentUrl = `https://api.github.com/repos/${owner}/${repo}/contents/README.md?ref=${defaultBranch}`;
    console.log('Fetching README from:', contentUrl);

    const contentResponse = await fetch(contentUrl, { headers });
    
    if (contentResponse.ok) {
      const contentData = await contentResponse.json();
      // GitHub API returns base64 encoded content
      const decodedContent = Buffer.from(contentData.content, 'base64').toString('utf-8');
      return decodedContent;
    }

    // If README.md not found, try readme.md
    const lowercaseContentUrl = `https://api.github.com/repos/${owner}/${repo}/contents/readme.md?ref=${defaultBranch}`;
    console.log('Trying lowercase readme:', lowercaseContentUrl);

    const lowercaseResponse = await fetch(lowercaseContentUrl, { headers });
    
    if (lowercaseResponse.ok) {
      const contentData = await lowercaseResponse.json();
      const decodedContent = Buffer.from(contentData.content, 'base64').toString('utf-8');
      return decodedContent;
    }

    throw new Error(`No README found in repository ${owner}/${repo}`);
  } catch (error) {
    console.error('Error fetching GitHub README:', error);
    throw new Error(error.message || 'Failed to fetch README content');
  }
}
