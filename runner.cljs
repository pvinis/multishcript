#!/usr/bin/env npx nbb

(ns multishcript
  (:require ["fs" :as fs]))

(when (not= 1 (count *command-line-args*))
  (println "Only use one arg, with the path to the multishcript you want to run.")
  (js/process.exit 1))

(def file (first *command-line-args*))

(when (not (fs.existsSync file))
  (println "Multishcript file doesn't exist.")
  (js/process.exit 1))

;; (println (str (fs/readFileSync file)))

;; (defmacro line-seq)



(defmacro with-open [bindings & body]
  (assert (= 2 (count bindings)) "Incorrect with-open bindings")
  `(let ~bindings
     (try
       (do ~@body)
       (finally
         (.closeSync cljs-made-easy.line-seq/fs ~(bindings 0))))))

(with-open [rdr (open-file file)]
  (println "ok"))
