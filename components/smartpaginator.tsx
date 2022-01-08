import { Pagination } from "react-bootstrap";
import { useState, useEffect } from "react";
import useViewport from "./useViewport";

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  xs: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
}

interface EllipsisState {
  right: boolean;
  left: boolean;
}

export default function SmartPaginator(props: PaginatorProps) {
  const viewport = useViewport();
  const { currentPage, totalPages, onPageChange, xs } = props;
  let { sm, md, lg, xl, xxl } = props;
  const sm_ = sm || xs;
  const md_ = md || sm_;
  const lg_ = lg || md_;
  const xl_ = xl || lg_;
  const xxl_ = xxl || xl_;

  const [pages, setPages] = useState<number[]>([]);
  const [ellipsis, setEllipsis] = useState<EllipsisState>({
    right: false,
    left: false,
  });

  useEffect(() => {
    let maxItems: number;

    switch (viewport) {
      case "xxl":
        maxItems = xxl_;
        break;
      case "xl":
        maxItems = xl_;
        break;
      case "lg":
        maxItems = lg_;
        break;
      case "md":
        maxItems = md_;
        break;
      case "sm":
        maxItems = sm_;
        break;
      default:
        maxItems = xs;
    }

    calculatePages(totalPages, maxItems);
  }, [totalPages, currentPage, viewport]);

  const calculatePages = (totalPages: number, maxItems: number) => {
    if (totalPages <= maxItems) {
      let tmp = Array.from(Array(totalPages + 1).keys());
      tmp.shift();
      setPages(tmp);
      setEllipsis({
        right: false,
        left: false,
      });
      return;
    }

    let pages = [];
    let start = currentPage - Math.floor(maxItems / 2);

    for (let i = 0; i < maxItems; i++) {
      if (start < 1) start = 1;
      if (start === totalPages) {
        pages.push(start);
        break;
      }
      pages.push(start);

      start++;
    }

    let cr = pages[0] - 1;
    while (pages.length < maxItems) {
      pages.unshift(cr);
      cr--;
    }

    let left = true;
    let right = true;
    if (pages[0] === 1) {
      left = false;
    }
    if (pages[pages.length - 1] === totalPages) {
      right = false;
    }

    setEllipsis({
      right,
      left,
    });
    setPages(pages);
  };

  return (
    <Pagination>
      <Pagination.Prev
        className="ms-auto"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />
      {ellipsis.left && (
        <>
          <Pagination.First onClick={() => onPageChange(1)} />
          <Pagination.Ellipsis disabled />
        </>
      )}

      {pages.map((page) => (
        <Pagination.Item
          key={page}
          onClick={() => onPageChange(page)}
          active={page === currentPage}
        >
          {page}
        </Pagination.Item>
      ))}

      {ellipsis.right && (
        <>
          <Pagination.Ellipsis disabled />
          <Pagination.Last onClick={() => onPageChange(totalPages)} />
        </>
      )}
      <Pagination.Next
        className="me-auto"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </Pagination>
  );
}
