import type { ReactNode } from 'react';

interface GuideImageProps {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly caption?: string;
}

export function GuideImage({ src, alt, width, height, caption }: GuideImageProps) {
  return (
    <figure className="guide-image">
      <img src={src} alt={alt} width={width} height={height} loading="lazy" />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

interface GuideTableCell {
  readonly id: string;
  readonly content: ReactNode;
}

interface GuideTableRow {
  readonly id: string;
  readonly cells: readonly GuideTableCell[];
}

interface GuideTableProps {
  readonly columns: readonly string[];
  readonly rows: readonly GuideTableRow[];
  readonly caption?: string;
}

export function GuideTable({ columns, rows, caption }: GuideTableProps) {
  return (
    <div className="guide-table-scroll">
      <table className="guide-table">
        {caption ? <caption>{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {row.cells.map((cell) => (
                <td key={cell.id}>{cell.content}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
