;; ClarityLearn Dictionary Contract
;; A simple key-value store for learning Clarity basics

;; Define the dictionary map FIRST (before any functions that use it)
(define-map clarity-dictionary
  { key: (string-ascii 32) }
  { value: (string-ascii 128) }
)

;; Public function to store a term
(define-public (store-term (key (string-ascii 32)) (value (string-ascii 128)))
  (ok (map-set clarity-dictionary { key: key } { value: value }))
)

;; Read-only function to get a term
(define-read-only (get-term (key (string-ascii 32)))
  (map-get? clarity-dictionary { key: key })
)