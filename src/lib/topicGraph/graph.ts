/**
 * Global Topic Graph Engine: Core Graph Data Structures
 * Defines strongly typed Nodes, Edges, and the in-memory TopicGraph
 * for connecting Localities, Tech Parks, Companies, Metros, Hospitals,
 * Colleges, Blogs, and Property/Rent/Buy/Office Landing Pages.
 */

export type NodeType =
    | 'locality'
    | 'tech_park'
    | 'company'
    | 'metro'
    | 'hospital'
    | 'college'
    | 'blog'
    | 'property'
    | 'rent_page'
    | 'buy_page'
    | 'office_page';

export type EdgeRelationship =
    | 'located_in'
    | 'adjacent_to'
    | 'near_tech_park'
    | 'serviced_by_metro'
    | 'employs_at'
    | 'covers_topic'
    | 'compares_with'
    | 'hub_of'
    | 'has_hospital'
    | 'has_college';

export interface TopicNode {
    /** Unique internal node ID e.g. "locality:whitefield" */
    id: string;
    /** URL-friendly slug e.g. "whitefield" */
    slug: string;
    /** Human-readable label e.g. "Whitefield" */
    name: string;
    /** Entity type */
    type: NodeType;
    /** Relative canonical path e.g. "/pg/whitefield" */
    path: string;
    /** Additional metadata e.g. latitude/longitude, keywords */
    metadata?: Record<string, unknown>;
}

export interface TopicEdge {
    /** Source Node ID */
    fromId: string;
    /** Target Node ID */
    toId: string;
    /** Semantic relationship classification */
    relationship: EdgeRelationship;
    /** Semantic relevance weight (higher = more relevant) */
    weight: number;
}

/**
 * In-memory directed semantic Topic Graph.
 * Supports fast node lookup and relationship-driven edge traversal.
 */
export class TopicGraph {
    private nodes: Map<string, TopicNode> = new Map();
    private edges: TopicEdge[] = [];
    private adjacency: Map<string, TopicEdge[]> = new Map();

    /** Add a node to the topic graph */
    public addNode(node: TopicNode): void {
        this.nodes.set(node.id, node);
        if (!this.adjacency.has(node.id)) {
            this.adjacency.set(node.id, []);
        }
    }

    /** Add a directed weighted edge to the topic graph */
    public addEdge(edge: TopicEdge): void {
        this.edges.push(edge);
        const list = this.adjacency.get(edge.fromId) || [];
        list.push(edge);
        this.adjacency.set(edge.fromId, list);
    }

    /** Retrieve a node by its unique ID */
    public getNode(id: string): TopicNode | undefined {
        return this.nodes.get(id);
    }

    /** Retrieve a node by its slug and type */
    public getNodeBySlugAndType(slug: string, type: NodeType): TopicNode | undefined {
        const targetId = `${type}:${slug.toLowerCase()}`;
        return this.nodes.get(targetId);
    }

    /** Return all nodes in the graph */
    public getAllNodes(): TopicNode[] {
        return Array.from(this.nodes.values());
    }

    /**
     * Retrieve all nodes connected from `nodeId`, optionally filtering by
     * relationship classification and target node type.
     */
    public getRelatedNodes(
        nodeId: string,
        relationship?: EdgeRelationship,
        typeFilter?: NodeType
    ): TopicNode[] {
        const edges = this.adjacency.get(nodeId) || [];
        const results: TopicNode[] = [];
        const seen = new Set<string>();

        // Sort edges descending by weight
        const sorted = [...edges].sort((a, b) => b.weight - a.weight);

        for (const edge of sorted) {
            if (relationship && edge.relationship !== relationship) continue;
            const target = this.nodes.get(edge.toId);
            if (!target) continue;
            if (typeFilter && target.type !== typeFilter) continue;
            if (!seen.has(target.id)) {
                seen.add(target.id);
                results.push(target);
            }
        }

        return results;
    }

    /**
     * Retrieves bidirectional related nodes (either outgoing or incoming edges).
     */
    public getBidirectionalRelatedNodes(
        nodeId: string,
        typeFilter?: NodeType
    ): TopicNode[] {
        const seen = new Set<string>();
        const results: { node: TopicNode; weight: number }[] = [];

        // Outgoing edges
        const outEdges = this.adjacency.get(nodeId) || [];
        for (const e of outEdges) {
            const target = this.nodes.get(e.toId);
            if (target && (!typeFilter || target.type === typeFilter)) {
                if (!seen.has(target.id)) {
                    seen.add(target.id);
                    results.push({ node: target, weight: e.weight });
                }
            }
        }

        // Incoming edges
        for (const e of this.edges) {
            if (e.toId === nodeId) {
                const source = this.nodes.get(e.fromId);
                if (source && (!typeFilter || source.type === typeFilter)) {
                    if (!seen.has(source.id)) {
                        seen.add(source.id);
                        results.push({ node: source, weight: e.weight });
                    }
                }
            }
        }

        return results
            .sort((a, b) => b.weight - a.weight)
            .map((item) => item.node);
    }
}
