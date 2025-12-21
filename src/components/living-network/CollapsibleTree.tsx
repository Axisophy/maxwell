'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TreeNode } from '@/lib/living-network/types';

interface CollapsibleTreeProps {
  data: TreeNode;
  defaultExpanded?: string[];
  linkPrefix?: string;
  maxLinkDepth?: number; // Only make items up to this depth clickable links
}

function TreeNodeItem({
  node,
  depth,
  expandedNodes,
  toggleNode,
  linkPrefix,
  maxLinkDepth,
}: {
  node: TreeNode;
  depth: number;
  expandedNodes: Set<string>;
  toggleNode: (id: string) => void;
  linkPrefix: string;
  maxLinkDepth: number;
}) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  const shouldLink = depth <= maxLinkDepth && node.rank !== 'domain' && node.id !== 'life';

  const paddingLeft = depth * 20;

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      e.stopPropagation();
      toggleNode(node.id);
    }
  };

  const content = (
    <div
      className={`
        flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer
        transition-colors
        ${node.isExtinct ? 'opacity-70' : ''}
        hover:bg-black/5
      `}
      style={{ paddingLeft: `${paddingLeft}px` }}
      onClick={handleClick}
    >
      {/* Expand/collapse icon */}
      {hasChildren ? (
        <span className="w-4 h-4 flex items-center justify-center text-black/40">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      ) : (
        <span className="w-4" />
      )}

      {/* Colour dot */}
      <span
        className={`w-2 h-2 rounded-full flex-shrink-0 ${node.isExtinct ? 'opacity-50' : ''}`}
        style={{ backgroundColor: node.color }}
      />

      {/* Name */}
      <span className={`font-sans ${node.isExtinct ? 'italic' : ''}`}>
        {node.name}
        {node.isExtinct && <span className="ml-1 text-black/40">†</span>}
      </span>

      {/* Species count */}
      {node.speciesCount && (
        <span className="ml-auto text-xs font-mono text-black/40">
          {node.speciesCount.toLocaleString()}
        </span>
      )}
    </div>
  );

  return (
    <div>
      {shouldLink && !hasChildren ? (
        <Link href={`${linkPrefix}/${node.id}`}>{content}</Link>
      ) : (
        content
      )}

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map(child => (
            <TreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
              linkPrefix={linkPrefix}
              maxLinkDepth={maxLinkDepth}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CollapsibleTree({
  data,
  defaultExpanded = ['life', 'eukarya'],
  linkPrefix = '/data/living-network',
  maxLinkDepth = 2,
}: CollapsibleTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(defaultExpanded));

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="font-sans text-sm">
      <TreeNodeItem
        node={data}
        depth={0}
        expandedNodes={expandedNodes}
        toggleNode={toggleNode}
        linkPrefix={linkPrefix}
        maxLinkDepth={maxLinkDepth}
      />
    </div>
  );
}
