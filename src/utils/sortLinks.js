
export const sortLinksByPrevId = (links) => {
    // Map 자료구조를 생성하여 link.id를 키로, link 객체를 값으로 저장
    const linksMap = new Map(links.map((link) => [link.id, link]));

    // 정렬된 결과를 저장할 배열
    const sortedLinks = [];

    // LinkedList를 따라갈 시작 노드 (prevLinkId가 null인 노드)
    let current = links.find((link) => link.prevLinkId === null);

    // 순환 참조를 방지하기 위해 방문한 노드 추적
    const visited = new Set();

    // LinkedList를 따라가며 정렬
    while (current) {
        // 순환 참조를 방지: 이미 방문한 노드라면 중단
        if (visited.has(current.id)) {
            console.warn("Circular reference detected in links. Aborting sort.");
            break;
        }

        // 현재 노드를 방문했다고 표시
        visited.add(current.id);

        // 현재 노드를 결과 배열에 추가
        sortedLinks.push(current);

        // 다음 노드 탐색
        current = linksMap.get(
            links.find((link) => link.prevLinkId === current.id)?.id
        );
    }

    // 누락된 노드가 있으면 뒤에 추가 (prevLinkId가 잘못 설정된 경우 처리)
    const remainingLinks = links.filter((link) => !visited.has(link.id));
    if (remainingLinks.length > 0) {
        console.warn("Some links were not connected. Adding them at the end.");
        sortedLinks.push(...remainingLinks);
    }

    return sortedLinks;
};
